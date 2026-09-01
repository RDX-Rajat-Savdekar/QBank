Leetcode + LP
Leetcode + LP
Low level Design + LP + how you use AI 
Focus LP's deatiled

--------------

2 normal interviews 

1 Bar Raiser( care more about cultural LP's fit, expect deep dive in Stories (both behvioral and techincal down to the line of code ) ( something along of the lines of wahtever you will Say will be held against you !! )

1 Hiring manager( care more about functional aspect hence the Q like use of ai or lld and stuff )

-------------


- OOP is diff that LLD


(interview on may 21, 
Round 1: 2 simple coding question with a couple behavioral. The coding was super easy, I was quite nervous but ended up getting the optimal solution for the first one and got a solution on the second just didn't have time to write it out. (Both questions were essentially two pointer)
Round 2: Bar Raiser - Senior SWE and a Manager sitting in and it was just all behavioral stayed energetic and positive throughout. Rambled on some questions but was able to clarify and get to the point this round went well for me.
Round 3: One coding question and a behavioral, Honestly, I didn't understand the question at all when it was given to me and I implemented a solution that was correct, but didn't account for a specific edge case. The interviewer was super quiet. I walked him through my solution and ran some dry cases talking throughout but he wasn't saying a word just gave me an edge case and asked how I would move forward with that. Honestly, not sure how I feel about that round but the questioning afterwards was quite positive and felt super conversational. Interviewer was super nice they all were his calm demeanor was semi intimidating but whatever LOL (DP Problem, its straight from leetcode and is genuinely quite difficult I wont even lie to you guys). Unfortunately I will not be saying what question it is incase that somehow impacts my chances at an offer but think money.
Round 4: LLD round + Behavioral. LLD was super simple to start and as the follow ups kept getting added on it got more tricky. But at the end of the day I was explaining everything and my thought process, the interviewer was able to follow along with what I was thinking and while the syntax and everything was good to a point he mentioned that he got my mental model down and that's all that he was really looking for. We had a conversation afterwards, felt good and he said qualities he looks for he saw in me so that's fire. When it comes to questions like this, just think of a real world example, and work backwards.
)

( interview on Jan 2026, 
I applied for the Amazon Software Development Engineer (SDE) New Grad role in Seattle in early January 2026. I knew from Glassdoor that the process typically spans 1–3 months, involves an online assessment (OA) followed by 3–4 technical/behavioral rounds, and is rated around 3.4–3.7/5 in difficulty. To prepare, I spent about 6 weeks doing LeetCode (mostly medium and some hard), focusing on arrays, strings, trees, graphs, dynamic programming, and intervals. I also reviewed core CS fundamentals (Big-O, hashing, concurrency basics), and read through Amazon’s 16 Leadership Principles, creating 2–3 STAR stories for each. For system design, I followed common SDE new grad material (high-level design of URL shortener, news feed, and rate limiter). I used ChatGPT for technical preparation and mock behavioral answers, and GitHub Copilot inside VS Code to practice clean coding patterns. The process started with a recruiter outreach email after I applied on the Company Website. The recruiter call was 30 minutes and mostly covered my background, work authorization, preferred locations, compensation expectations, and a brief overview of the process (OA → one technical screen → virtual onsite loop with 3 rounds including a bar raiser). There were no coding questions on this call but I was asked high-level about my experience with Java and AWS services (mainly EC2 and S3) from an internship. About a week later, I received the OA link. The OA had two parts: OA1 was debugging/logic questions and OA2 was two LeetCode-style coding questions plus a Work Style Assessment. OA1 had 7 small debugging problems in Java and some logic/math questions; I had to fix bugs in code snippets within a time limit. OA2 was 90 minutes: the first question was a medium array/intervals problem (merging overlapping intervals and then answering queries), and the second was a harder DP/greedy hybrid on picking non-overlapping jobs with maximum profit. The environment auto-judged my code with hidden test cases. After the coding portion, the Work Style Assessment asked 30–40 multiple-choice questions mapping to leadership principles like Ownership, Bias for Action, and Dive Deep. I used ChatGPT beforehand to brainstorm how to interpret the LPs but answered the assessment honestly. About 10 days after completing the OA, I heard back that I passed and was invited to a 45-minute virtual technical interview over Amazon Chime. The interviewer was a mid-level SDE based in Seattle. We used a shared online coding editor (similar to CollabEdit) with no IDE features. After a quick intro, he gave me a string-based LeetCode-style question: given a string, find the length of the longest substring without repeating characters and return the substring itself. I walked through a brute-force O(n^2) solution, then moved to an optimized sliding window with a HashMap for last-seen indices in O(n) time. I narrated my thought process and wrote code in Java. He asked follow-ups about edge cases (empty string, all same character, Unicode), and then we briefly discussed time/space complexity. After that, he asked a couple of CS fundamentals questions about hash maps (collision handling, load factor) and memory (stack vs heap). The last 10 minutes were behavioral: I got one LP question around “Tell me about a time you had to dive deep into a production issue” and I used a STAR story from my internship where we debugged a memory leak in a Java microservice using AWS CloudWatch metrics and heap dumps. The interviewer was engaged, occasionally prompted me when I got stuck, and gave subtle hints but didn’t give away the solution. Two weeks later, the recruiter emailed me to schedule the final onsite loop (virtual onsite) with three 1-hour rounds on the same day. There was a small scheduling delay due to interviewer availability, so the loop happened about a month after the OA. The loop consisted of: one DSA-focused coding round, one mixed low-level design/technical round, and one bar raiser that was heavy on Leadership Principles plus a medium coding question. In the first loop round, the interviewer (another SDE) gave me a medium tree/graph problem: given a 2D grid of 0s and 1s, count the number of islands (connected components of 1s using 4-directional adjacency). I explained both DFS and BFS solutions, discussed recursion depth versus an explicit stack/queue, then implemented DFS in Java. We then discussed optimization and trade-offs in using recursion vs an iterative approach to avoid stack overflow on large grids. The second round was more of a low-level design plus coding round. I was asked to design a simplified in-memory key-value cache with eviction, supporting get and put with O(1) time complexity and LRU eviction when capacity is exceeded. I proposed an architecture using a combination of a HashMap and a doubly linked list. I drew the design verbally and in the shared editor, implemented the Node class and the LRUCache class in Java, and handled edge cases. We also briefly talked about how this would differ if it were a distributed cache using something like Amazon ElastiCache or Redis: consistent hashing, sharding, and cache invalidation strategies. The final round was with a bar raiser (a senior engineer with many years of experience at Amazon). It was about 60% behavioral, 40% coding. I was asked several deep LP questions: examples around Ownership, Insist on the Highest Standards, and Have Backbone; Disagree and Commit. For each, I used the STAR format and tried to quantify impact (e.g., reduced error rate by X%, improved latency by Y ms). The coding portion was a variant of an intervals problem: given a set of intervals, insert a new interval and merge any overlapping intervals. I talked through sorting, merging logic, and implemented a clean solution. The bar raiser pushed on details: how would this scale with millions of intervals, what if intervals stream in real-time, and how would I test this thoroughly. Throughout the process, there was minimal live feedback; interviewers wouldn’t indicate pass/fail signals. They were generally professional, though the bar raiser was more intense and often asked follow-up questions to test depth. The main challenges for me were managing time during OA2, staying calm while coding in a plain text editor without autocomplete, and keeping all my LP stories fresh in mind during the long loop day. I also found the uncertainty between rounds stressful; after the loop I waited about three weeks before getting a final update. In the end, I received a "No Offer" decision due to team fit/headcount constraints according to the recruiter. The recruiter said my DSA performance was solid but I needed more depth in system design and more concrete examples tied to certain Leadership Principles like Customer Obsession. Despite the rejection, the experience matched what I saw on Glassdoor: a structured but demanding process, heavy emphasis on coding, online assessments, and the Leadership Principles. It gave me a clear sense of Amazon’s expectations and helped me identify gaps in my system design and behavioral storytelling. experience
)

(The interview process for the Amazon Software Development Engineer (SDE) New Grad role took a little under three months end-to-end. It followed a fairly standard Amazon pattern that aligns with recent Glassdoor reports for SDE/Software Engineer roles: Online Assessment (skills test + work style/personality test), one technical screen via video, and then a multi-round virtual onsite loop including a bar raiser. Timeline: - Week 0: Applied through the Amazon Company Website for the SDE New Grad role in Seattle. - Week 1: Received recruiter outreach via email and scheduled a 30-minute introductory call for later that week. - Week 2: Completed the recruiter call and received the Online Assessment (OA) link within a couple of days. - Week 3: Completed OA (OA1 + OA2 + Work Style Assessment) in one sitting. - Week 5: Informed by the recruiter that I passed the OA; scheduled a 45-minute technical phone/video interview over Amazon Chime. - Week 6: Completed the technical screen. - Weeks 7–8: Some delay due to interviewer availability; then invited to the final loop. - Week 9: Completed a 3-round virtual onsite loop (3 x 60-minute interviews happening back-to-back with short breaks). A bar raiser participated in the last round. - Week 12: Received final decision via email and a short debrief call with the recruiter. Details of each component: 1) Recruiter Screen (30 minutes, Amazon Chime) - Focus: Background, resume walk-through, basic understanding of role, preferred locations, and immigration status. - No live coding. High-level questions about experience with Java, data structures, and familiarity with AWS (e.g., EC2, S3) based on my internship. - Tools: Amazon Chime for video/audio. - Outcome: Explanation of the process: Online Assessment → Technical Screen → Virtual Onsite (3 rounds including bar raiser), consistent with Glassdoor’s reported stages (skills test, phone interview, one-on-one interviews, and a personality/work style test. 2) Online Assessment (OA) – 2 hours total - Delivered via Amazon’s proprietary OA platform linked from an email. - OA1 (Debugging/Logic): - Duration: ~35–40 minutes. - Content: 5–7 debugging questions in Java/C++ style code, plus logical/maths problems. Required identifying and fixing bugs in provided code snippets under time pressure. - OA2 (Coding + Simulation): - Duration: ~90 minutes. - Content: Two LeetCode-style medium to medium-hard coding problems (arrays/intervals and DP/greedy), auto-graded with hidden test cases. One problem resembled a typical interval merging question; the other was a job scheduling/max profit variant. - Work Style Assessment: - Duration: ~15–20 minutes integrated at the end of OA2. - Format: 30–40 multiple-choice questions assessing alignment with Amazon’s 16 Leadership Principles (e.g., Ownership, Bias for Action, Dive Deep). This matched the personality/work style test mentioned in Glassdoor data. 3) Technical Phone/Video Interview (45 minutes, Technical Round) - Timing: About two weeks after OA completion. - Tool: Amazon Chime with a shared online code editor. - Structure: - 5 minutes: Intros and quick background questions. - 30 minutes: One main coding problem (string/array based, LeetCode medium difficulty). Required walking through a brute-force solution and then optimizing to a sliding-window approach with HashMap and O(n) complexity. - 5–10 minutes: CS fundamentals (hash maps, memory model) and 1–2 short behavioral questions tied to Leadership Principles. - The interviewer evaluated problem-solving approach, clarity of communication, and code correctness rather than just final output. 4) Virtual Onsite Loop (3 rounds, each 60 minutes) – Onsite Interview - Conducted over Amazon Chime as a virtual onsite, consistent with recent Glassdoor reports that many Amazon "onsites" are now remote but still treated as full loops. - Time between scheduling and loop: ~2 weeks. Round 1 – DSA/Algorithms (60 minutes) - Format: One main coding problem plus minor follow-ups. - Question type: Medium difficulty grid/graph problem (count islands) involving DFS/BFS and careful handling of state (visited matrix). - Evaluation: Code quality in Java, handling of edge cases, time/space complexity explanation, and ability to discuss iterative vs recursive approaches. Round 2 – Low-Level Design + Coding (60 minutes) - Format: Hybrid of low-level design and implementation. - Question type: Design and implement an LRU cache with O(1) get/put operations and eviction when at capacity. - Discussion included: - Choice of data structures (HashMap + doubly linked list) and why. - Potential extensions to a distributed cache scenario (e.g., using Amazon ElastiCache or Redis, sharding, consistent hashing). - Handling concurrency at a high level (locks vs lock-free, but not deeply implemented). Round 3 – Bar Raiser (Behavioral + Coding) (60 minutes) - Interviewer: Senior engineer acting as bar raiser. - Structure: ~35–40 minutes behavioral, ~20–25 minutes coding. - Behavioral: Deep dive into multiple Amazon Leadership Principles, asking follow-up questions to test consistency and depth. Required comprehensive STAR-form answers. - Coding: An intervals-based LeetCode medium problem (inserting and merging intervals) with discussion on scaling to large datasets and thorough testing strategy. Common Tools and Practices: - Amazon Chime for all video interviews. - Browser-based plain-text style coding editor (no autocomplete, minimal syntax highlighting). - Internal OA platform for skills test, debugging, and work style assessment. - Strong emphasis on Leadership Principles in every round, especially in the loop and bar raiser. Assignments/Tests: - Online Assessment served as the primary skills test and personality test. - No separate take-home project; all coding was live during OA and interviews. Overall, the process lined up closely with Glassdoor’s descriptions for Amazon SDE roles: skills test as OA (including debugging and DSA questions), phone/Chime interview, one-on-one technical interviews in the loop, personality/work style assessment, and a bar raiser round. Communication between stages was generally clear but there were noticeable gaps (1–3 weeks) between OA, technical screen, and final decision, reflecting the multi-week to multi-month timelines reported by other candidates.

)



- 4 round, 1 day(mostly)
- 1 Hiring Manager
- 1 Behavioral
- 2 Behav + Coding

- 1 Q for coding (similar to google's)
- uses Livecode ( internal tool )
- "“Because no code is ever run on an editor, the approach, speed, and testing are most important. Code syntax, typos, variable naming, and edge cases are less important.”"
- Shy away from DP, in favor of Graphs ( long code / but fast )
- "if there’s anything ‘at the bar’ or ‘below the bar’ for LP, then you fail.”
- They do a pre-brief and then debrief
- Amazon interviewer’s grade on a 5-point scale: Strongly Inclined, Inclined, Neutral, Not Inclined, Strongly Not Inclined
- The two most important interviewers at the onsite are the Bar Raiser and the hiring manager. At Amazon, all of the other team members involved in the interview could vote to hire, but if the Bar Raiser or the hiring manager aren’t on board, that candidate is likely getting rejected.
- But that being told, it is for quality control and hardly ever a bar raiser doesn't align with the overall decisions


- Each Project / Each Work ex Make a list of stories
- Map those stories in a matrix to each LP
- Load Balance ( find which LP have low stories and add them )
- Each LP ( divided by HM to within each interviwer ), has a certain amazon bar
- For each answer ( to a Q for a LP ), they decide if you are at the bar, below the bar or above the bar ( which is considered to be above 50% for all the people at that level )
- the Followups on a Q is usually you not providing enough of either of these S(sitatuion) T(task) A(action) R(result)
- prepare poor version of answer for each stories ( to understand and be able to practice the followups )
- 




Youtube Channels
- Amazon Bound has each separate videos on each LP's (16)
- Holly lee ( I didn't find her much useful for new grads at least )
- Bahroz Abbas has private coaching sessions recordings
- have all the stories and imp points written in front of you in bullet form ( your job in the interview is to process the information and not memorize it )
- 


Question to ask,
- 
- 



LP's Sample Questions:
Amazon leadership principles and sample questions: 
1- Customer obsession: tell me about a time you had a deal with a difficult customer. Or describe a situation where you negotiated win win 
2- Ownership: Tell me about a tough situation during your project or tell me a tough situation you made during a project event
3- Invent and simplify: tell me about a time when you solved a complex  problem and how you went about doing it? Or How you handle roadblocks or obstacles?
4- Right a lot -Strong judgment and good instincts: tell me about A time you had to make a decision without much customer data or with a lack of data  or tell me about a time when you had to convince team members on something that you proposed
5- Learn and be curious: tell me about a time you build out a process  or tell me about a skill that you recently learned
6- Hire and develop the best: tell me about a time when you had a conflict with some one. How did you resolve in it, what did you learn or tell me about a time when you fired someone? 
7- Insist on the highest standards: A time you had to make a decision to make short term sacrifices for long term gains or tell me about a time when you made a decision based on data and you were ultimately wrong
8- Think Big: Your greatest success? Or tell me about a time when you were creative?
9- Bias for action: How have you convinced others to take action? How have you managed risk in a project?
10- Frugality: tell me about a time you turned down more resources to complete a process or tell me about a time you had to accomplish big results with very little budget
11- Earn trust: An example of how you managed a conflict  or How do you earn the trust of your team members?
12- Dive deep: : tell me about a time the most complex project you worked on? Have you changed an opinion or direction using data
13- Have a backbone, disagree, commit: : tell me about a time you had a disagreement with your manager? Or How do you manage difficult conversations?
14- Deliver results: Describe a challenging product you worked on why it is challenging. Or How do you prioritize  
15- Strive to be Earth's best employer: : tell me about a time you had to motivate a team after a demonizing event?  :tell me about a time when employee gave you a negative feedback
16- Responsibility: : tell me about a time you had a problem and how to discover a real cause? Or Describe a time when your project failed











- UnderStand the Problem
1. Read it twice
2. Once to understand the problem
3. Second to understand if there is any ambiguity in the Q(to help lead clarifying Q )

- Walk through the example out loud
( to help understand the input and output expected )

- Ask Clarifying Questions:
1. Edge cases and their outputs
2. Input/Output format
3. Scale constraints

- Design an Algorithm:
1. M = minimally sketch the naive solution 
2. I = identify upper and lower bound
3. K = Look for triggers
4. E = employ problem solving booster 

---> Booster:
1. B = brute force optimization
2. H = hunt for propertier
3. D = decrease the difficulty
4. C = cycle through the catalog
5. A = articulate your blocker

- Explain the Solution:
1. Examples ( dry run )
2. Simple English  ( to help you guide through the code logic )
3. Name and Justify ( shows language knowledge )

- Get Buy-In
Ask the Magic Question as follows - ( one big statement overall )
1. So this is the algorithm + [ explain in simple terms ] + [mention TC and SC ] + do you want to see me code it up ?
( here the interviewer might block you from going in the wrong direction or lead you to think for another approach )

- Code the Solution:
1. Main logic
2. helper Function ( if they take time just comment them for now, since main focus is on the main logic of the code )
3. Stop if you get lost

- Verify the Solution:
( common mistake here is to test the concept not the code )
( we are supposed to test the actual written code here, and then verify it's correctness aka logic/concept in mind simultaneously )
1. top to bottom pass
2. Tricky inputs
3. Dry run with tiny input
4. Check edge casses
5. Verify analysis

- End ( some stuff to do after the code )

1. Proactively Suggest to build Unit Test for the code( shows you care about production level code )

2. sanity check the TC and SC after the coding
( low level details might have deviated from original consideration)





---

# Appended Phase 2 — extras (do not rewrite anything above)

Moved from `interview Q's/Rajat_notes.md`. Voice and typos kept on purpose.

## Patterns Q (33 interviewer patterns)

Source: `extras/zonline discord/amazon Patterns Q.txt`

﻿# Amazon SDE Interview Patterns & Hidden Signals
> Derived from dozens of interview reports shared in the Discord server.
>
> This is **not** a list of questions.
> This is a list of **patterns**—how interviewers think, how they test candidates, and the "traps" that repeatedly appear.

---

# 1. Amazon Rarely Cares About The Final Answer

This was probably the biggest pattern.

Candidates who got offers often said:

> "I never finished."

> "My code wasn't complete."

> "He kept saying assume this already exists."

> "We didn't even run the code."

Meanwhile candidates who coded silently often felt they bombed.

### What they are actually evaluating

- How you think
- How you communicate
- Tradeoffs
- Ability to evolve the design
- Engineering judgement

NOT

- Perfect syntax
- Finishing every feature

---

# 2. They Intentionally Give Vague Requirements

This happened repeatedly.

Examples

- Design Pizza
- Design Shopping Cart
- Design File Search
- Design Parking Lot
- Design Wishlist

Notice...

Almost no requirements.

That's intentional.

They're testing

> Can you gather requirements?

NOT

> Can you guess requirements?

Good candidates spent

5-10 minutes

asking questions.

---

# 3. Interviewers Like To Add Requirements Midway

This is probably Amazon's favorite move.

Examples

Pizza

↓

Now support drinks.

File Search

↓

Now support directories.

Cache

↓

Now different teams want different eviction strategies.

Music Player

↓

Delete songs by artist.

Parking Lot

↓

Motorcycles.

Locker

↓

New locker sizes.

Noodles

↓

More toppings.

They almost never stop after the base implementation.

They're checking

Open Closed Principle.

---

# 4. Every LLD Is Secretly Testing SOLID

Very few interviewers ever said

"Show me SOLID."

Instead

they'll say

"What if..."

Those "what ifs"

ARE

SOLID.

Example

"What if tomorrow we add another notification channel?"

They're testing

Dependency Inversion.

---

# 5. Patterns Matter More Than Patterns™

Nobody cared about memorizing 23 GoF patterns.

The same ones appeared repeatedly.

- Strategy
- Factory
- Decorator
- Observer
- Composition

Almost never

Visitor

Flyweight

Interpreter

Mediator

---

# 6. Follow-ups Are More Important Than The Original Question

A surprising amount of candidates said

"The original problem was easy."

Then...

follow-up

follow-up

follow-up

follow-up

The interviewer keeps evolving requirements.

---

# 7. Code Is Often Never Executed

Many reports mentioned

- Whiteboard
- Google Docs
- Shared document

No compiler.

No IDE.

No testing.

One interviewer literally said

"Assume this exists."

---

# 8. Interviewers Prefer Clean Skeletons

Instead of

500 lines

they wanted

20 classes

with

good relationships.

---

# 9. Interfaces Score Surprisingly High

Many successful candidates mentioned

"I introduced an interface."

Immediately

follow-ups became easier.

Common example

Instead of

Pizza

Make

Item

Then

Pizza

Drink

Dessert

---

# 10. Don't Overimplement

Several interviewers literally stopped candidates.

Example

Chess

No need to implement

checkmate

stalemate

etc.

Instead

Stub methods.

Explain verbally.

---

# 11. Communication Is A Huge Score

Candidates who constantly explained

did well.

Candidates who silently coded

felt worse.

Amazon interviewers frequently interrupt

asking

"Why?"

not

"What's next?"

---

# 12. Every Story Gets Challenged

LP interviews are not

Tell story.

Done.

Instead

Story

↓

Follow-up

↓

Metric

↓

Why metric?

↓

Alternative?

↓

Business impact?

↓

Customer impact?

↓

Would you do differently?

Sometimes

20 minutes

on ONE story.

---

# 13. Metrics Matter More Than People Expect

This appeared constantly.

Expect

How did you calculate that?

Why that metric?

Why not another?

Business impact?

Customer impact?

How do you know?

Interviewers rarely accept

"It improved performance."

They want

"It reduced latency by 30% because..."

---

# 14. They Dig Until They Find Something You Didn't Do

Example

"I improved deployment."

Interviewer

Who decided?

Who implemented?

Who tested?

Who approved?

They're trying to understand

YOUR contribution.

Not your team's.

---

# 15. LP Stories Need Ownership

Many candidates accidentally answered

"We..."

Amazon wants

"I..."

---

# 16. The Same Story Can Answer Multiple LPs

Candidates repeatedly recommended

5-7 stories.

Not

14 stories.

One story can answer

Ownership

Dive Deep

Bias for Action

Customer Obsession

Highest Standards

depending on emphasis.

---

# 17. They Like "Unexpected Failure"

Questions like

Tell me about a time

you expected success

but got failure.

Not

Tell me about failure.

Subtle difference.

---

# 18. Root Cause Is Huge

"Dive Deep"

appeared more than anything.

Expect

How did you know?

What evidence?

How did you eliminate possibilities?

What data?

---

# 19. Conflict Doesn't Mean Fighting

Several reports

Conflict with

Manager

Peer

Stakeholder

Customer

They don't want drama.

They want

Professional disagreement.

---

# 20. GenAI Questions Are Increasing

Nearly every recent report mentioned AI.

Common questions

- How do you use AI?
- Do you trust AI?
- Hallucinations?
- Verification?
- Productivity?

Hidden evaluation

Engineering judgement.

Not AI knowledge.

---

# 21. They Care If You Verify AI

Worst answer

"I use ChatGPT for everything."

Best answer

"I treat it like a junior engineer."

---

# 22. Coding Questions Often Have Amazon Twists

Examples

Reorganize String

↓

Unicode equivalencies.

Lottery

↓

Weighted probability.

Website Pattern

↓

No premium access.

Word Count

↓

Leading spaces.

Two Sum

↓

No HashMap.

Tree

↓

Custom serialization.

Graph

↓

Business context.

The twist

is often harder than the original LC.

---

# 23. Graphs Show Up More Than Expected

Patterns observed

- BFS
- DFS
- Dijkstra
- Topological Sort
- Connected Components
- Union Find

---

# 24. Design Questions Are Usually Disguised LeetCode

Examples

Design Stack

↓

Min Stack

Design Linked List

↓

LRU

Cache API

↓

Strategy Pattern

Unix Find

↓

Composite + Filters

---

# 25. They Sometimes Mix Rounds

Examples seen

Round

LP

↓

LC

↓

OOD

Round

OOD + LP

Round

LC + LP

Round

All LP

Round

LC only

Don't assume

one topic

per interview.

---

# 26. Hiring Managers Tend To Talk More

Many reports

Hiring Manager

↓

Long LP discussion

↓

One LC

↓

GenAI

Very conversational.

---

# 27. Bar Raisers Dig Much Deeper

Patterns

- Metrics
- Ownership
- Why?
- Why?
- Why?

Much fewer technical hints.

---

# 28. Whiteboards Are Still Common

Several candidates

never opened IDE.

Everything

whiteboard

or

Google Docs.

---

# 29. Some Interviewers Give Hints

Common

"Assume this already exists."

"Don't worry about implementation."

"Keep going."

Take the hint.

Don't over-engineer.

---

# 30. They Sometimes Ask About Internal Implementation

Examples

How does HashMap work?

Can HashMap be a Set?

Why interface?

Why abstract class?

Why not inheritance?

Expect OOP fundamentals.

---

# 31. "Open For Extension" Is Almost Guaranteed

Nearly every LLD eventually became

"What if..."

That's the entire interview.

Can your design survive change?

---

# 32. Weird Questions Reported

These appeared only once or twice.

- Fire TV Remote typing algorithm
- Weighted lottery winners
- Terminal command parser
- Coffee shop nearest 3
- Basketball league ranking
- Employee query language
- Package dependency installer
- Notification channels
- Transportation network
- Car park analytics
- Music player API
- Wishlist
- Currency conversion graph
- First one-time visitor
- Browser history variation

Don't memorize them.

Notice the pattern underneath.

---

# 33. Hidden Meta Pattern

Amazon is testing

"Would I want to maintain your code for the next five years?"

Everything

coding

LLD

LP

GenAI

points back to that single question.

Can you

- communicate?
- write maintainable code?
- adapt?
- own problems?
- learn?
- think before coding?

If yes,

the exact question matters much less.

---

# Final Advice

If you only remember one thing from all these interview reports:

**Talk constantly.**

Explain:
- why you're making a decision,
- what assumptions you're making,
- what trade-offs exist,
- and how your design or solution could evolve.

The strongest candidates weren't the ones with perfect code—they were the ones who made it easy for the interviewer to follow their thinking.


## zhandoff philosophy

Source: `extras/zonline discord/zhandoff.txt`

The goal is NOT "What questions will I get?"

The goal IS "What is Amazon actually trying to measure?"

Expected loop (ordering may differ):

- Round 1 — Technical + LP
- Round 2 — Technical + LP
- Round 3 — Technical / Bar Raiser
- Round 4 — Hiring Manager

What they are actually evaluating (from the research brief):

- Coding: mostly LC Easy/Medium, graphs more than expected, custom business-context variations, follow-ups common
- LLD: requirement gathering, extensibility, SOLID, communication — not complete implementations
- LP: metrics, business impact, customer impact, ownership, why decisions were made
- GenAI: engineering judgement, not AI knowledge

Full brief kept below.

﻿# Amazon SDE 1 (New Grad) Interview Research — Base Handoff

# Objective

This repository is intended to become the most complete, evidence-backed preparation guide for the Amazon SDE 1 (New Grad) interview loop (primarily US, but noting regional differences where relevant).

The goal is **not** to memorize questions.

The goal is to understand:

- what Amazon is actually evaluating,
- why they ask certain questions,
- recurring interview patterns,
- how successful candidates approach interviews,
- and how to prepare efficiently.

---

# Current Progress

We have already manually collected a large number of interview reports from:

- Discord servers
- Reddit
- Candidate notes
- Personal interview experiences
- Shared repositories

These have already been organized into:

- LC Question Bank
- LLD/OOD Question Bank
- LP Question Bank
- Interview Pattern Notes

The uploaded chat logs contain hundreds of interview experiences that have already been partially extracted.

These files should be treated as primary context.

---

# Existing Findings

## Coding

Patterns observed:

- Mostly LC Easy / Medium
- Rare LC Hard
- Graphs appear more than expected
- Custom business-context variations are common
- Follow-ups are extremely common

Common themes:

- BFS
- DFS
- Graph traversal
- Union Find
- DP
- Sliding Window
- Binary Search
- Design questions (LRU, MinStack, etc.)

---

## LLD / OOD

Strong recurring questions:

- Pizza Price Calculator
- Parking Lot
- Unix File Search
- Amazon Locker
- Shopping Cart
- Wishlist
- Notification System
- Cache API
- Music Player
- Library Management
- Package Dependency
- Basketball League
- Employee Query

Major observation:

Interviewers care much more about

- requirement gathering
- extensibility
- SOLID
- communication

than complete implementations.

---

## LP

Recurring themes:

- Dive Deep
- Ownership
- Conflict
- Missed Deadline
- Critical Feedback
- Learned Something New
- Out of Responsibility
- Tight Deadline
- Root Cause
- Helping Others

Strong observation:

Interviewers repeatedly drill into

- metrics
- business impact
- customer impact
- ownership
- why decisions were made

---

## GenAI

Recent interview reports increasingly include GenAI questions.

Typical questions:

- How do you use AI?
- How do you validate AI?
- Hallucinations
- Productivity
- Trust
- Security
- Engineering judgement

Observation:

Interviewers are not testing AI knowledge.

They are testing engineering judgement.

---

# Major Patterns Already Identified

1.

Amazon intentionally gives vague requirements.

They expect clarification before coding.

---

2.

Follow-ups are more important than initial implementation.

---

3.

LLD is really a test of SOLID.

---

4.

Communication is heavily weighted.

---

5.

Behavioral interviews are mostly follow-up driven.

---

6.

Metrics matter.

Candidates are expected to justify:

- why those metrics
- how they measured them
- business impact

---

7.

Coding interviews are often discussion-heavy.

Many interviewers:

- don't run code
- use whiteboards
- say "assume this exists"

---

8.

Open Closed Principle appears repeatedly.

Interviewers almost always introduce new requirements midway.

---

# Files Available

The uploaded Discord logs contain:

- LC reports
- OOD reports
- LP reports
- candidate observations
- interview timelines

These should be incorporated into the research instead of rediscovered.

Examples mentioned include:

- AmazonBound
- Holly Lee
- Discord interview collections

Treat these as supporting evidence.

---

# Desired Deliverables

The final research should contain TWO deliverables.

## Deliverable 1

A comprehensive research report with citations.

This should explain:

- what was found
- where it came from
- confidence level
- recurring patterns
- contradictions
- regional differences

Every significant claim should be backed by a source.

---

## Deliverable 2

A synthesis document.

This should read like an internal Amazon interview guide.

Instead of listing questions, explain:

- why questions are asked
- what interviewers evaluate
- common mistakes
- ideal responses
- preparation strategy

The emphasis should be on understanding the interview rather than memorizing it.

---

# Expected Interview Loop

Research should deeply analyze each round separately.

Round 1

Technical + LP

Round 2

Technical + LP

Round 3

Technical / Bar Raiser

Round 4

Hiring Manager

(The exact ordering may differ.)

The report should identify:

- differences between rounds
- interviewer goals
- evaluation criteria
- common question types
- expected depth
- follow-up style

---

# Important Philosophy

The goal is NOT

"What questions will I get?"

The goal IS

"What is Amazon actually trying to measure?"

The report should continually answer this question.


## Gemini loop / OA 2026 claim

Source: `extras/Gemini_Report_Amazon SDE New Grad Interview Research (2).pdf` only.
The `(3)` file is a byte-identical dupe and is ignored so we never ingest twice.

- Pipeline starts with an OA, typically HackerRank.
- **2026 OA claim:** 90–120 minutes, three parts: a DSA test, an interactive backend coding exercise with an **AI-assisted development partner**, and a behavioral Work Style Assessment.
- After OA: onsite loop, 3–4 sequential 45–60 min interviews (Chime or in-person).
- 2026 onsite add-on: **Gen AI Fluency** — how you integrate AI code-generation tools, with metrics. Not abstract coding only.
- Internal grades: Above Bar / At Bar / Below Bar, separate from Incline / Not Incline.
- Bar Raiser can veto even if the rest of the loop votes hire.

## FTC vs new-grad

Sources: `extras/WhatsApp Image 2026-08-20 at 22.58.10*.jpeg` (r/amazonsdeprep). Role values must stay `sde-new-grad` vs `sde-ftc`.

**FTC (contract), reported:**

- OA: hard DSA (Fenwick mentioned) + AI-assisted debug + work-style / LP sections
- Then two interviews: 2 medium DSA + 2 LP each (graphs, monotonic stack, 2D DFS/BFS, greedy) plus resume questions
- Shorter than full-time: 1–2 phone screens, then onsite / panel; STAR; know your resume

**New-grad onsite, reported:**

- Sometimes a lightweight LLD / OOD prompt; treat as coding plus a short objects/API-tradeoff chat
- Clarify use cases, name a few core objects, explain one or two tradeoffs
- IQB interview question bank + Beyz timed mocks mentioned in-thread
- Some candidates only got LLD

## Resources

- https://interviewing.io
- https://start.interviewing.io/showcase
- https://interviewing.io/learn#interview-process-and-questions-by-company
- https://www.youtube.com/@Alpha-Code/videos
- Amazon Bound (per-LP videos)
- Bahroz Abbas (private coaching recordings)
- Holly Lee — already discounted for new-grad
- DDIA 2026, System Design Interview vol 1/2
- https://mockpad-kappa.vercel.app/
- r/amazonsdeprep (FTC + new-grad LLD threads)
- IQB interview question bank, Beyz timed mocks
- IGotAnOffer Amazon interview guide
- Hello Interview (HLD)
- Official Amazon LP docs / careers loop pages
- Amazon Bedrock / Q Developer docs — GenAI type page references only
