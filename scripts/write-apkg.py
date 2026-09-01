#!/usr/bin/env python3
"""Write a minimal Anki 2.1 .apkg from a JSON card list. Stdlib only."""
import hashlib
import json
import os
import sqlite3
import sys
import tempfile
import time
import zipfile

MODEL_ID = 1607392319
DECK_ID = 2059400110


def checksum(text: str) -> int:
    return int(hashlib.sha1(text.encode("utf-8")).hexdigest()[:8], 16)


def write_apkg(cards: list, dest: str) -> None:
    now = int(time.time())
    tmp = tempfile.mkdtemp()
    db_path = os.path.join(tmp, "collection.anki2")
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    cur.executescript(
        """
        CREATE TABLE col (
            id integer primary key, crt integer not null, mod integer not null,
            scm integer not null, ver integer not null, dty integer not null,
            usn integer not null, ls integer not null, conf text not null,
            models text not null, decks text not null, dconf text not null,
            tags text not null
        );
        CREATE TABLE notes (
            id integer primary key, guid text not null, mid integer not null,
            mod integer not null, usn integer not null, tags text not null,
            flds text not null, sfld integer not null, csum integer not null,
            flags integer not null, data text not null
        );
        CREATE TABLE cards (
            id integer primary key, nid integer not null, did integer not null,
            ord integer not null, mod integer not null, usn integer not null,
            type integer not null, queue integer not null, due integer not null,
            ivl integer not null, factor integer not null, reps integer not null,
            lapses integer not null, left integer not null, odue integer not null,
            odid integer not null, flags integer not null, data text not null
        );
        CREATE TABLE revlog (
            id integer primary key, cid integer not null, usn integer not null,
            ease integer not null, ivl integer not null, lastIvl integer not null,
            factor integer not null, time integer not null, type integer not null
        );
        CREATE TABLE graves (
            usn integer not null, oid integer not null, type integer not null
        );
        CREATE INDEX ix_notes_usn on notes (usn);
        CREATE INDEX ix_cards_usn on cards (usn);
        CREATE INDEX ix_revlog_usn on revlog (usn);
        CREATE INDEX ix_cards_nid on cards (nid);
        CREATE INDEX ix_cards_sched on cards (did, queue, due);
        CREATE INDEX ix_revlog_cid on revlog (cid);
        CREATE INDEX ix_notes_csum on notes (csum);
        """
    )

    models = {
        str(MODEL_ID): {
            "id": MODEL_ID,
            "name": "QBank Basic",
            "type": 0,
            "mod": now,
            "usn": 0,
            "sortf": 0,
            "did": DECK_ID,
            "tmpls": [
                {
                    "name": "Card 1",
                    "ord": 0,
                    "qfmt": "{{Front}}",
                    "afmt": '{{FrontSide}}<hr id="answer">{{Back}}',
                    "did": None,
                    "bqfmt": "",
                    "bafmt": "",
                }
            ],
            "flds": [
                {
                    "name": "Front",
                    "ord": 0,
                    "sticky": False,
                    "rtl": False,
                    "font": "Arial",
                    "size": 20,
                    "media": [],
                },
                {
                    "name": "Back",
                    "ord": 1,
                    "sticky": False,
                    "rtl": False,
                    "font": "Arial",
                    "size": 20,
                    "media": [],
                },
            ],
            "css": ".card { font-family: arial; font-size: 18px; text-align: left; color: black; background-color: white; white-space: pre-wrap; }",
            "latexPre": "\\documentclass[12pt]{article}\n\\special{papersize=3in,5in}\n\\usepackage[utf8]{inputenc}\n\\usepackage{amssymb,amsmath}\n\\pagestyle{empty}\n\\begin{document}\n",
            "latexPost": "\\end{document}",
            "req": [[0, "any", [0]]],
            "tags": [],
            "vers": [],
        }
    }
    decks = {
        "1": {
            "id": 1,
            "name": "Default",
            "extendRev": 50,
            "usn": 0,
            "collapsed": False,
            "newToday": [0, 0],
            "revToday": [0, 0],
            "lrnToday": [0, 0],
            "timeToday": [0, 0],
            "mod": now,
            "dyn": 0,
            "desc": "",
            "conf": 1,
            "extendNew": 10,
        },
        str(DECK_ID): {
            "id": DECK_ID,
            "name": "QBank",
            "extendRev": 50,
            "usn": 0,
            "collapsed": False,
            "newToday": [0, 0],
            "revToday": [0, 0],
            "lrnToday": [0, 0],
            "timeToday": [0, 0],
            "mod": now,
            "dyn": 0,
            "desc": "Interview question bank",
            "conf": 1,
            "extendNew": 10,
        },
    }
    dconf = {
        "1": {
            "id": 1,
            "mod": 0,
            "name": "Default",
            "usn": 0,
            "maxTaken": 60,
            "timer": 0,
            "autoplay": True,
            "replayq": True,
            "new": {
                "bury": True,
                "delays": [1, 10],
                "initialFactor": 2500,
                "ints": [1, 4, 7],
                "order": 1,
                "perDay": 20,
                "separate": True,
            },
            "lapse": {
                "delays": [10],
                "leechAction": 0,
                "leechFails": 8,
                "minInt": 1,
                "mult": 0,
            },
            "rev": {
                "bury": True,
                "ease4": 1.3,
                "fuzz": 0.05,
                "ivlFct": 1,
                "maxIvl": 36500,
                "minSpace": 1,
                "perDay": 100,
            },
        }
    }
    conf = {
        "nextPos": 1,
        "estTimes": True,
        "activeDecks": [DECK_ID],
        "sortType": "noteFld",
        "timeLim": 0,
        "sortBackwards": False,
        "addToCur": True,
        "curDeck": DECK_ID,
        "newBury": True,
        "newSpread": 0,
        "dueCounts": True,
        "curModel": str(MODEL_ID),
        "collapseTime": 1200,
    }
    cur.execute(
        "INSERT INTO col VALUES (1,?,?,?,11,0,0,0,?,?,?,?,?)",
        (
            now,
            now * 1000,
            now * 1000,
            json.dumps(conf),
            json.dumps(models),
            json.dumps(decks),
            json.dumps(dconf),
            "{}",
        ),
    )

    for i, card in enumerate(cards, start=1):
        front = str(card.get("front") or "")
        back = str(card.get("back") or "")
        tags = " " + " ".join((card.get("tags") or "").split()) + " "
        note_id = now * 1000 + i
        flds = f"{front}\x1f{back}"
        cur.execute(
            "INSERT INTO notes VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            (
                note_id,
                f"qbank-{i}",
                MODEL_ID,
                now,
                -1,
                tags,
                flds,
                front[:80],
                checksum(front),
                0,
                "",
            ),
        )
        cur.execute(
            "INSERT INTO cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (
                note_id + 1,
                note_id,
                DECK_ID,
                0,
                now,
                -1,
                0,
                0,
                i,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                "",
            ),
        )

    con.commit()
    con.close()

    with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.write(db_path, "collection.anki2")
        zf.writestr("media", "{}")


def main() -> None:
    cards = json.loads(sys.stdin.read())
    dest = sys.argv[1]
    write_apkg(cards, dest)
    print(f"wrote {len(cards)} notes → {dest}")


if __name__ == "__main__":
    main()
