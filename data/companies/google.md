Mock notes

1. Make assumptions ( give choice to the interviewer not just ask them )
2. Dry run ( catch the bugs good )
3. Dry run, do it on all the edge cases ( reframe dry run to call it verification ) 
4. Clear all the assumptions of like [], NONE, negative, etc. depending on the Q
5. Having the core Knowledge of the data structures and their TC ( Must have )
6. being idiomatic in terms of the language (python), use them, gives good signal ( but be aware of the TC of every operation you are using ) 
7. Jumping to code ( depends on the interviewer ) might be more of what they want to test you on rather than the algorithm itself. So get the go-ahead of coding as soon as the algorithm is explained completely, ( they will stop you based on if they want to test you on the code or logic )
8. Good variable naming ( don't use reserved words )
9. Small logical comments ( to help dry run / communicate logic / catch bugs )
10. Pacing of all the steps was correct 
11. Use dosc string and type description of python and follow the standard completely ( or don't them at all, don't do half of them )




System Prompt: The RDX Technical Interview Architect
Your Role: You are an elite technical interview coach simulating a Google L3/L4 software engineering evaluation. Your goal is to provide a highly structured, executable interview script based on the "RDX Format." Do not provide generic coding tutorials; provide a strategic, simulated interview performance formatted entirely as a single Python file.
The Core Philosophy (Context for LLM): The modern technical interview evaluates "independent implementation," collaborative dynamics, and architectural foresight. It is not an adversarial exam; it is a "Teammate Test." High scores require generating specific signals:
* Edge Case First Architecture: Handling invalid states via Guard Clauses rather than nested spaghetti code.
* The MIKE Framework: Establishing mathematical boundaries (lower/upper bounds) before designing an algorithm.
* Transparent Communication: Narrating logic purely conceptually ("Indented English") before writing syntax.
* Formal Buy-In: Utilizing the "Magic Question" to force alignment with the interviewer before coding.
* The Human Debugger: Executing manual, line-by-line variable tracing instead of mentally testing "concepts."
Formatting Directives: You must strictly follow the 6-step RDX format below.
1. Single Python Block: The ENTIRE output must be contained within a single ```python ... ``` code block.
2. Top Docstring: Sections 1 through 4 must be written inside a multi-line docstring (""" ... """) at the top of the file.
3. Executable Code: The main Python code must sit in the middle. It must be production-ready, featuring exactly one version of the code, full type hints, a standardized function docstring, and a small amount of concise inline comments indicating key logical steps.
4. Naming: Use semantic, professional variable names (no single-letter variables unless they are standard loop indices like i or j).
5. Bottom Docstring: Sections 5 and 6 must be written inside a multi-line docstring (""" ... """) at the bottom of the file.
The RDX Format Template (Fill this out for the requested problem):
Python

"""
1. CLARIFYING QUESTIONS & ASSUMPTIONS
- Q: [Highly specific question the candidate should ask to clear assumptions, e.g., scale, data types]
  A: [Optimal answer an interviewer would give]
- Q: [Question 2]
  A: [Answer 2]
- Q: [Question 3]
  A: [Answer 3]

2. APPROACHES (MIKE FRAMEWORK)
- Lower Bound: [Define absolute mathematical limit, e.g., \Omega(N)]
- Approach 1: [Name of naive/brute force approach]
  Logic: [Brief description]
  Complexity: [Time/Space complexity]
  Reject: [Reason for rejecting, e.g., TLE risk]
- Approach 2: [Name of optimal approach]
  Logic: [Brief description]
  Complexity: [Time/Space complexity]
  Accept: Optimal.

3. INDENTED ENGLISH (LOGIC)
- [Abstract, narrative step-by-step breakdown of the chosen algorithm in complete English sentences.]
- [Do not write pseudo-code. Describe data structures and pointer movements.]
- [Step 3]
- [Step 4]

4. THE MAGIC QUESTION (BUY-IN)
"[2-3 sentence quoted script summarizing the time/space complexity and the core mechanism, ending with a formal request to begin coding.]"
"""

def optimal_solution_function(param: int) -> int:
    """
    Standardized docstring describing what the function does.
    """
    # GUARD CLAUSE: Architectural edge case handling
    if not param:
        return 0
        
    # Main logic implementation with semantic naming and light inline comments
    pass

"""
5. VERIFICATION (HUMAN DEBUGGER)
[Tricky Input Example, e.g., param = [2, 3, 1, 2]]
- Initialize: [State variables]
- Loop step 1: [Update variables exactly as a human would trace on a whiteboard]
- Loop step 2: [Update variables]
- Loop step 3: [Update variables]
- Return: [Final output]

6. PRODUCTION SANITY CHECK
- Final Time Complexity: [Restate with brief justification]
- Final Space Complexity: [Restate with brief justification]
- Testing: [List 2-3 specific "Negative Test" scenarios for a production unit testing suite]
"""
User Request: [Insert LeetCode Problem Title / Description Here]







asa code paheje finally

"""
1. CLARIFYING QUESTIONS & ASSUMPTIONS
- Q: Are all words exactly the same length?
  A: Yes, exactly 6 lowercase letters.
- Q: What happens if I guess a word and the API returns 0?
  A: You can eliminate the guessed word AND any word in the list that shares even a single character 
  in the same position as the guessed word.

2. APPROACHES (MIKE FRAMEWORK)
- Lower Bound: \Omega(N) per guess to filter the search space.
- Approach 1: Random Guessing
  Logic: Pick a random word.
  Complexity: High likelihood of failing the 10-guess limit.
  Reject: Non-deterministic and risky.
- Approach 2: Heuristic Filtering (Minimax / Random)
  Logic: Pick a word (randomly or by calculating frequency overlaps). Call the API. If it returns `match_count`,
    we know the secret word MUST also have exactly `match_count` overlaps with our guessed word. 
    We filter our list to only keep words that share exactly `match_count` characters with our guess, drastically shrinking the pool.
  Complexity: O(N) per guess, O(N) overall due to geometric shrinking.
  Accept: Statistically guarantees finding the word within 10 guesses for realistic constraints.

3. INDENTED ENGLISH (LOGIC)
- Define a helper function `get_matches(word1, word2)` that counts exact positional matches between two 6-letter words.
- Loop up to 10 times (the maximum allowed guesses):
    - Select a candidate word from our current list (using a random choice prevents edge-case adversarial lists from trapping us).
    - Call the API to get the actual `match_count` with the secret.
    - If `match_count` is 6, we found the secret! Break.
    - Build a new candidate list. For every word in the old list, check if `get_matches(candidate, word) == match_count`.
    - Replace the old list with this strictly filtered new list.

4. THE MAGIC QUESTION (BUY-IN)
"Since we have a strict limit of 10 guesses, we need to aggressively prune the search space. I will use a heuristic filtering approach: I'll guess a word, get its match count, and then eliminate any word from our candidate pool that does not share that exact number of positional matches with my guess. Shall I implement this filter loop?"
"""

import random
from typing import List

class Master:
    def guess(self, word: str) -> int:
        pass # Provided by the interview environment

def findSecretWord(words: List[str], master: 'Master') -> None:
    """
    Finds the secret word by heuristically filtering candidates based on match overlaps.
    """
    def get_matches(w1: str, w2: str) -> int:
        return sum(1 for a, b in zip(w1, w2) if a == b)
        
    candidates = words[:]
    
    for _ in range(10):
        if not candidates:
            break
            
        # Randomly select to avoid adversarial worst-case inputs
        guess_word = random.choice(candidates)
        matches = master.guess(guess_word)
        
        # Success condition
        if matches == 6:
            return
            
        # Filter candidates: The secret MUST have the exact same overlap with the guess
        candidates = [w for w in candidates if get_matches(guess_word, w) == matches]

"""
5. VERIFICATION (HUMAN DEBUGGER)
secret = "abc", list = ["xyz", "abc", "abd"] (assume 3 chars for brevity)
- Loop 1: guess "xyz". API returns 0 matches.
  - Filter: get_matches("xyz", "abc") is 0. Keep. get_matches("xyz", "abd") is 0. Keep.
  - candidates = ["abc", "abd"]
- Loop 2: guess "abd". API returns 2 matches ('a', 'b').
  - Filter: get_matches("abd", "abc") is 2. Keep.
  - candidates = ["abc"]
- Loop 3: guess "abc". API returns 3. Success!

6. PRODUCTION SANITY CHECK
- Final Time Complexity: O(N) where N is the number of words. The list shrinks exponentially, meaning we do far less than 10 * N comparisons.
- Final Space Complexity: O(N) to store the dynamically shrinking candidates list.
"""




[8/20/26, 10:55:27 PM] Rajat Savdekar:  if you are not doing anything after this, i say make list of behav stories you want, prepare like you are doing this for amazon,
[8/20/26, 10:55:27 PM] Rajat Savdekar: i'll share some stuff here, go through them before those stories.
like really read through each one, so you understand what is applicable to you
[8/20/26, 10:55:27 PM] Rajat Savdekar: Make a bunch of stories,
Map them to these signals.


When they ask a Question, understand what signal are they looking for and then select the best one which gives the most signalz
[8/20/26, 10:55:27 PM] Rajat Savdekar: Stories can overlap with many signals that's fine, the main thing is answering the core signal and presentation of the answer overall

- -----------------

Q - Mistake ? 
-->
Hypothesis on why what you did in the start was reasonable
you realising when the mistake was done
you making resolution to fix 

what you did next time

- -----------------

Q - Project you are most proud of ?
-->
- end to end ownership
- Impact
- scope
- handle ambiguity
- showing that you went through SDLC
- For l3 story is suppose to be feature level and can have guidance along the way
- Followup based on past and future


------------------
Q - Tell me a time about Conflict ?
-->
Conflict Stories:Should have Consequence ( high stakes )
should involve you deeply in the problem and the solution
what happened between you and the person at the end

Time:( the interviewer are looking for is the repeatable part i.e the thing you learn from the experience )
- Focus around 60% of the time in the Action
- 10% ( give only enough context needed for the project )
-  20% on the result
-  10% for the Learnings

Checklist for Response:
- Find the Q behind the Q
- Show empathy
- Show some kind of objective ( not subjective ) way to resolve a conflict
- The communication channel
- Win / Win overall at the end

Red Flags:
- hiding the emotional content ( ack it gracefully )
- not showing empathy
- Waiting too long ( sense of urgency is important overall )
- -----------------

Q - Disagree with a manager ?
-->
- needs to be done in a respectful way
- candidate need to justify the pushback



Practice Mock Interviews ( with only short bullet points as assistance )..

Be ready for the Big 3, which are 
tell me about yourself
Tell me about a time you had to deal with a difficult co-worker and other is
Tell me about your most proudest project. 


Also re-read all the stories and make a mapping of 2 things! 
FAQs to a particular Story 
Signal Decoded to Story 


For one story Build the core features (so that we can  select the narrative to fit the Q) 
Main thing is followps, I need to be prepare for both technical and behavorial followups for my stories. 
(per discovery not meant to check validity they don't Can't Care and verify, main aim to put you on Spot to think what would you do I thinking on the feet, 



new tips:Mock 3:

1 - you and a coworker didn't get along -> team lead frustrated ( requiring too much guidance )
Followups: what was the frustration,  how did you improve the communication, when did this overall started, when did the confrontation start, was the thing okay at the end, 

Feedbacks: 


2 - your behavior impacted a team ( positive impact, maybe like your team dynamic improved ) -> using teaching skills to help new hires
Followups: how does L4 helps L3, 

Feedback: 


3 - you went above and beyond ->
Followups:

Feedback:

4 - imagine teammate have different approach how do you decide immediately -> schedule meeting, pros/cons, want the whole team in the meeting, make cases. manager makes the final decision
Followups: what details of the project might help you in such situation, can't call a meeting what to do,  

Feedback:


5 - Incorporate perspective of different users into a product ->
Followups: what was the outcome, 

Feedback:


6 - A manager style that you liked -> Transparency, One on One ( with clear agenda), took responsibility Ownership, never felt like micro managing, 
Followups: 

Feedback: 

7 - A manager style you disliked -> 
Followups:

Feedback:

{
red flag - timeline ( issue could have been resolved sooner ) 
An overall theme of mis-communications
}


{Tell me about a time bad with coworker?

Tech lead and TC had an issue with communication. Tech lead didn't want a solution that TC wanted. So TC moved to tech lead's manager.

TC called meeting 1-1 with TL in order to air out differences. This improved communication since there was no other choice. Talked about frustrations with the situation. TL felt that TC required too much guidance. TC felt that subtext was that TC embarrassed TL in front of supervisor since TC's approach was correct.

This set them about on a better trajectory for communication. TC communicated back to TL that if he was frustrated with him that he was frustrated with him or progress to separate it from the content of the communications. To set them aside and remain cordial.

TL was able to see that he was blending those factors and agreed to make an effort to compartmentalize.

TL was a teammate not manager. TL for over a year and a half. The miscommunication started from beginning. Things were always bad since TC was a noogler and project started 4 months in so TC was also onboarding.

The airing of differences happened at the end. And for the end of the project things were better.

Better to nip it in the bud.

Tell me about a time when your behavior positively impacted your team.

On the team at Google of 12, there was a strange dynamic where TC was L3. TC was only L3. Team started hiring hiring L4's on top of L3 but TC had being #4 seniority ranked with most knowledge but lowest level.

TC had been a teacher before SWE. TC found TC's self teaching L4 nooglers onboarding. TC acted like a mentor to these new hires. TC got kudos.

Followup: How did this dynamic work?

It helped team cohesion. Especially since it helped TC show TC's value to contribute. TC helped onboard onto the on call.

Tell me a time you went above and beyond to make sure a product served user's well.

TC was at a small media company. TC was launching a video streaming service. TC was transitioning from QA to backend. The company ran into difficulty with the vendors tasked with making the launch happen. Not doing a job and holding back launch.

TC was doing the work to make the launch happen that the vendors were not doing. Working late nights for weeks leading up to the launch. Launch succeeded.

The vendors were so far behind that they could not make the deadline. So it was assumed they couldn't do it and they would worry about getting a refund later.

Imagine two teammates have differing opinions on a project. How would you help decide on an approach? There is a deadline.

Schedule an hour long meeting. Get everyone in a room. Write the approaches down with pros and cons. Whole team. Everyone brainstorms the pros and cons. Each person could advocate for their cause. The manager should stay quiet with veto power.

Follow up: What details would you want to know about the project? Tight deadline. You can't call a meeting with people. You help decide. You have the veto power.

The project needs to be done in a quick way with technical debt. Go ahead and incur the tech debt then fix later.

Followup: How do you minimize the tech debt?
Find a scope adjustment. In order to do it the right way, can we reduce the scope in order to buy more time to work with to find a solution for the larger problem.

Tell me about a time you needed different perspectives on a project? How did you do it? What was the outcome?

TC made an API change to a service. TC wanted to deprecate one of the versions. They were unable to do it because 1 or 2 big customers needed it.

TC and team had to get the clients to migrate to the new api. TC and them convinced them that it was feasible and painless. The team helped them migrate their code. Sent documents and a POC based on their thorniest use cases.

Outcome: one less api to manage and maintain. 3 versions were going at that point. V2 was coming out too soon.

Tell me about a manager style you liked.

Transparency is important. TC's first manager at Google, gave substantive feedback in 1 on 1's. He had clear agendas. He was open to what TC wanted to talk about to. He would plan later 1 on 1's too. He'd say in "2 weeks we discuss A. 5 weeks we discuss B." Kept a doc with this roadmap.

As a noogler this was super helpful. Lets get everything out there to talk about it.

He took a lot of responsibility. If TC was having trouble, then he took responsibility for it to solve it to find resources etc. Ownership. But never felt like micro managing.

He called something "perf together" where they went over perf together before perf.

Tell me about a manager style you disliked.

Interim manager was former manager's manager. Impossible to have relationship since he had too many direct reports and it was temporary.

Too many reports and hard to believe that he would get in there and do it. TC takes this as a fault on himself too by challenging him to manage more.}


Mock 2 ( senior roles ):

1 - Project had a conflict? -> 
Followups: what were different media type PM wanted, how did you proceed after the MVP, 

Feedback: 


2 - You realized you were wrong? ->
Followups: none

Feedback:


3 - what do you do when you are stuck on coding? -> Document all the assumptions, make yourself unstuck, seek help, move to something different than wasting time.
Followups: 

Feedback:

---------debrief--------- 
kind of ramble a lot, focus on knowing how the answer is going to end while practicing, don't go on side tangents on your own give an overview then let them decide to deep dive, need the story to have a direct conflict ( like showing some kind of tradeoff than just cutting scope )
--------------------


4 - Juggling multiple project how do you prioritize? ->
Followups: 

Feedback:


5 - how to delegate a task to someone who doesn't want to do it? ->
Followups: 

Feedback:

6 - Underperforming teammate? -> 
Followups: was the issue of project being too hard or the intern was not able to do it, 

Feedback:


7 - Bad Feedback? -> slow progress
Followups: how have you taken this learning in your day to day.

Feedback:

---------debrief--------- 
a bit better, listen to how you answer this Qs ( people usually hate it ), summarization ( always do it, sometimes you don't ), behavioral at google atleaset is more about checking red flags and overall leveling signals ( than the quality of the engineer per se ), 

{Overall, you did a decent job. I would give a leaning hire rating instead of a hire rating / leaning no hire rating since you did demonstrate all the right Senior SWE attributes without throwing up red flags. Some suggested ways to improve include:

- Know where your story is ending (you got better at this throughout but can keep improving)
- Record yourself answering behavioral questions and listen back to yourself (you can do that for our practice session today too)
- Try to re-summarize your points at the end for emphasis. Repetition throughout the middle of answers could work too to emphasize your points
- Make sure you have a clear and direct path to answering the question. This wasn't always the case (ex: underperforming intern)
- Make sure to demonstrate clear senior+ signal throughout your answers.

Overall, I don't think behavioral interviews are a significant issue for you. Good luck on your onsites!} 









Mock 1:
1 - Complex Project end to end? -> not enough context for q1,
Followups: clarify the scope of the project, timeline, alternatives considered, 

Feedback: weak reply ( needed to take out details ), use STA(focus on action)R, not  clear task, action part need more details, result was good, need to clarify the context, give reason why it ( the task ) was being prioritized, what was your role, mention timeline, showing reasoning of tradeoff was good and imp, showing how you work in ambiguity is good, show result in terms of impact (numbers), good candidate mention the long term vision(and planning) of the action, mention areas of improvement while doing the action.


2 -  a significant mistake that failed? -> better overall
Followups: did the company implemented the suggestion you gave,

Feedback: Interviewer is taking notes on back ( to ask followups ), seemed like a reply need this to be in terms of a story ( think of explaining a friend ), personal and technical post mortem, have your story in front of you ( practice giving answer like mock, don't spend time thinking, it should come naturally to you ), some Q could be about growth like tough feedback or cross team projects ( shows collaboration ),
leadership Q are mostly for senior L5+
[ Collaboration, Growth, Perseverance, Adaptability, have one story under each  ideally ], practice delivery of the stories ( intonations , pauses and all )

conflict resolution, focus on take initiative to help resolve ( middle ground, data , etc. )
Perseverance, show that you adapt based on the negative feedback ( shows growth mindset )
Adaption, how to reprioritize the work so that they are relevant in the new context, communicate to the team, bonus if you help someone else
Growth, ( where you had to learn something new ), Initiative in your own learning,
Collaboration and Teamwork, help resolve team conflict, did you help in improving team dynamics.


45 min, expect like 4 or 5 Q depending on the signals , maybe end early if they have enough signal, number of stories is not imp, how they are telling the story is more imp than anything, remember what is expected at each level, and be a good person overall ( general expectation ), use numbers and approximation where possible. 

some people don't have good stories ( very trivial stories )..

{What was good:
- Mentioning the tech complexity behind database migrations (relational database has X and Spanner has Y, that's why migration was hard).
- Good quality stories with numbers!
- Improving with STAR framework during the session.

What could be improved:
- **Clearly** define the problem and the business/user need.
- Explain WHY this technical challenge was hard and the solution you've implemented (briefly, then dive deep).Mention the trade-offs you've considered (e.g., choosing a specific database, API design, or algorithm).
- State the final outcome and provides metrics for success (e.g., "reduced latency by 150ms," "increased user engagement by 5%"). If NDA, you can say "several" or mention O(1, 10, 100..)

EXTRA POINTS for candidates during behavioral interviews. You can make note of these:
- Discussed the long-term vision.
- Proactively identify potential future problems or areas for improvement in their design.
- Mention how they collaborated with or influenced others (e.g., other teams, product managers, senior engineers) to get the project done.
- Describe a really hard tech challenge that was beyond their specific task/expecation.


Types of stories and L4 signals on each:
- Conflict Resolution
Did you take initiative to help resolve the conflict?
Did you help find middle ground?
Did you use data to support your position?
Did you reflect on what you learned?

- Perseverance
Did you show how you adapted your approach based on results and feedback?
Did you demonstrate initiative in finding solutions?
Did you effectively communicate progress and setbacks?

- Adaptability
Did you effectively reprioritize tasks when needed?
Did you clearly communicate changes to the team?
Did you reflect on lessons learned about handling change?

- Growth Mindset (not that often occurring in interviews)
Did you proactively seek learning opportunities to address skill gaps?
Did you take initiative in your own development?
Did you help others learn and grow?

- Collaboration & Teamwork
Did you help resolve team conflicts?
Did you contribute to improving team dynamics?
Did you describe a situation where you worked effectively as part of a team?}




Give me an example of a time when you did not meet a client’s expectation. What happened, and how did you attempt to rectify the situation?

Give me an example of a time when you were 75% of the way through a project, and you had to pivot strategy–how were you able to make that into a success story?

Tell me about a time when you had to work with limited time or resources.

Tell me about the time when you failed and what you learned from it?

Tell me about time where you had solved difficult problem

How do you show your customer obsession?

Tell me about time when you had to leave task unfinished

Tell me about time when you had to work on project with unclear responsibilities

Tell me about a time when you were wrong

Tell me about time when you solved a problem through superior knowledge or Observation

Tell me about a time when you needed to get information from someone who isn't very responsive. What did you do?

Tell me about a time when you did not accept the status quo.

Tell me about an unpopular decision of yours.

Tell me about a time when you had to step up and disagree with team members' approach.

If your direct manager was instructing you to do something you disagreed with, how would you handle it?

Give me an example of a time you faced conflict while working on a team. How did you handle that?

Tell me about a time when you received negative feedback from your manager. How did you respond?

Tell me about a time you wished you had handled a situation differently with a colleague.

Describe a time when you anticipated potential problems and developed preventive measures.

Describe a situation in which you found a creative way to overcome an obstacle.

Can you describe a time when you had to handle a difficult customer or client?

Tell me about a situation where you had to lead a team to achieve a challenging goal.

Can you share a time when you had to adapt to a new technology or software system at work?

Describe a situation where you had to work on a cross-functional team.

Can you provide an example of a time when you had to solve a complex problem at work?

Tell me about a time when you had to prioritize multiple tasks with competing deadlines.

Can you describe a situation where you had to provide constructive feedback to a colleague or subordinate?

Tell me about a time when you had to handle a crisis or unexpected problem at work.

Can you share a situation where you had to motivate your team during a period of low morale?

Describe a time when you had to make a difficult decision with limited information.



[8/20/26, 10:55:28 PM] Rajat Savdekar: I did this, may or may not work for you,

Make docs like these for reference to use whole practice and also while interview
[8/20/26, 10:55:28 PM] Rajat Savdekar: The Big 3
Tell me about yourself
Conflict story
Project with most impact,

These should be like the most important things you should have prepped which occur in most of the interviews



[8/20/26, 10:55:28 PM] Rajat Savdekar: These are the Imp chapter from the book I have, read them to understand the intuition....not too long like 3 4 hours you can read them
[8/20/26, 10:55:28 PM] Rajat Savdekar: Context - Situation and Task ( only enough not extra )

Action

Result

Learning ( different from result, internal changes you made kind of the )



Fairly similar to Star
[8/20/26, 10:55:28 PM] Rajat Savdekar: https://interviewing.io/




These are the Imp chapter from the book I have, read them to understand the intuition....not too long like 34 hours you can read them
7:05PMJ/
Context - Situation and Task (only enough not extra)
Action
Result
Learning ( different from result, internal changes you made kind of the )
Fairly similar to Star
introduce yourself,
tell me about a time when you made an assumption that was wrong and how that impacted the project
7:06 PM //
what do you do in a situation where one of teammates for taking credits others work, and how do you avoid this situation in the future
7:06 PM //
situation where the team you joined, there tech stack is new to you, and all the teammates are senior than you
7:06 PM J/
situation where one of the teammates is of different culture or has different perspective
7:06 PM //
a time when you helped one of your coworker and what was situation
7:06 J/
a time when you had more things to do than possible.
7:06 PM J/
Most important or impactfull project
7:06 PM //
Why Google



[8/20/26, 10:55:28 PM] Rajat Savdekar: https://www.youtube.com/@Alpha-Code/videos
[8/20/26, 10:55:28 PM] Rajat Savdekar: https://start.interviewing.io/showcase
[8/20/26, 10:55:28 PM] Rajat Savdekar: 1st ques was finding len of longest subseq in an array with a condition that difference btw numbers shoukd be more or less than 1, follow up was difference shoukd be at most k now
[8/20/26, 10:55:28 PM] Rajat Savdekar: 2nd was a v weird question, abt trie it was, basically a prefix is given and i need to validate an input of array
[8/20/26, 10:55:28 PM] Rajat Savdekar: With a wild card in the prefix too, and follow up for suppose now i have web server and I need to assign input links to the best match prefix how will I do that
[8/20/26, 10:55:28 PM] Rajat Savdekar: I suggest he book gheun ghe nhi t PDF bagh online asle t ( mala physical books aavdta ), https://a.co/d/032LG5K2
[8/20/26, 10:55:28 PM] Rajat Savdekar: https://a.co/d/0eChV23f
[8/20/26, 10:55:29 PM] Rajat Savdekar: Design data intensive application ( 2026 edition ), system design vol 1 and vol 2
[8/20/26, 10:55:29 PM] Rajat Savdekar: https://mockpad-kappa.vercel.app/
[8/20/26, 10:55:29 PM] Rajat Savdekar: http://youtube.com/watch?v=mIfFoOdfZp0
[8/20/26, 10:55:29 PM] Rajat Savdekar: Good guide for Amazon and also in general, for preparing stories and understanding the behavioural part of the interview
[8/20/26, 10:55:29 PM] Rajat Savdekar: actually google doesn’t care much about behvoral interviews ( like at all ), so me kahe jast focus nhi kela hota tya vr teva

pan answers and stories structured hote maze barobar
[8/20/26, 10:55:29 PM] Rajat Savdekar: he vicharle hote mala, just rapid fire
[8/20/26, 10:55:29 PM] Rajat Savdekar: but amazon khup care krt if you are a culture fit or not, so me aata amazon sathi actually reverse krto aahe, leetcode kami and behavioral prep jast
[8/20/26, 10:55:29 PM] Rajat Savdekar: in general tula jar big tech cha overview paheje asel n tr he articles read kr sarve ekdum mast and to the point and correct aahe ya vr
[8/20/26, 10:55:29 PM] Rajat Savdekar: https://interviewing.io/learn#interview-process-and-questions-by-company
[8/20/26, 10:55:29 PM] Rajat Savdekar: Google process was, 
1 OA,

Round 1, 2 online interviews, 1 leetcode - 1 googlyness

Round 2, 2 onsite interviews, both leetcode
[8/20/26, 10:55:29 PM] Rajat Savdekar: also one more tip, for OA’s submitting the code as fast as you can ( even like in 10 min is a good sign ), so cheat and cheat away as much as you can in OA’s, they are not an important filter ( also everyone cheats so….(
[8/20/26, 10:55:29 PM] Rajat Savdekar: Yes and also company vr depend krte, ke Google and ase kahe company tumala thought process vr grade krta, and amazon / meta ase kahe companies tumala speed vr grade krta ( in sense ke they would like you to solve the question as fast as you can, a proxy for efficiency and understanding)






---

# Appended Phase 2 — extras (do not rewrite anything above)

Moved from `interview Q's/Google/notes.md`. Question list for the bank stays in `q.md`.

## CARL (L3 prefers this over bare STAR)

Source: `extras/Google Behavioral Interview Report Generation.pdf`

CARL = Context / Actions / Results / Learnings.

- Context (10%): stakes and constraints, not company history
- Actions (60%): I designed / I coded / I negotiated — builder verbs
- Results (20%): numbers
- Learnings (10%): the L3 differentiator. Growth mindset. An L3 who learns becomes an L4.

Decode the signal → select the story → deliver CARL.
Unlike STAR, Learnings is first-class. Hiring committees want failure processed into a better next time.

### Googliness L3 table

| Signal area | L3 expectation |
|---|---|
| Ambiguity | Move forward when requirements are vague, docs missing, or the path is undefined |
| Bias for Action | Unblock yourself; fix broken processes or tools without waiting for permission |
| Collaboration | Team over ego. Unblock peers, share knowledge, raise group velocity |
| Psychological Safety | Peers can fail, ask, or disagree without fear |
| Growth Mindset | Failure is data; seek feedback; iterate on process |
| Customer Empathy | Understand the user behind the code; trade off for them |

Do: I-statements, 60% action, quantify, talk trade-offs, admit mistakes, clarify the question.
Don't: only "we", stuck in context, vague outcomes, solutions as obvious, blame others, prepared monologue that misses the prompt.

L3 is execution excellence on a defined task plus knowing when to escalate. Not L5 strategy.

## L3 Deep Dive — teammate test

Source: `extras/Google L3 Interview Deep Dive (1).pdf`

Evaluators use the **Teammate Test**. Many candidates treat the session as a one-sided exam and wait for instructions. Successful candidates treat it as a teammate discussion: they guide the session, propose next steps (test cases, edges), and manage the problem-solving arc. That signals autonomy.

L3 vs L4: L3 is given a problem and solves it. L4 is given a vague objective and determines the problem. Speed on a standard algorithm is treated as fluency, not just efficiency.

The RDX ritual already in this file is the same idea: Magic Question buy-in, Human Debugger, teammate not adversary.

## Resources (public, well-known)

- https://interviewing.io
- https://start.interviewing.io/showcase
- https://interviewing.io/learn#interview-process-and-questions-by-company
- https://www.youtube.com/@Alpha-Code/videos
- IGotAnOffer Google interview guide
- Hello Interview (HLD)
- `extras/Google_Interview_Prep.pdf` — 289-page pattern curriculum, not a question dump
- Official Google engineering / careers loop pages
