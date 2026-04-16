# What is Shomosite?

This is Shomo's (your user's) personal website. 



When in doubt about implementing something, take a look at gwern's website once: [https://github.com/gwern/gwern.net](https://github.com/gwern/gwern.net)

# Agent Instructions

This repository utilizes an evolving context journal for AI agents. 
Any AI agent operating in this workspace MUST review and append to the active journal located at:

`_journals/_J-Agent.md`

## Rules for Journaling:

1. Always maintain the **Roadmap** list at the top of the journal. **CRITICAL: Do NOT use the Roadmap as a temporary to-do list for immediate tasks.** Immediate tasks should be handled in your temporary implementation plans. The Roadmap is strictly for long-term items and features to be built down the line.
2. Log your entries under a heading formatted exactly as: `## Date - Model - Workspace`.
3. Entries for a new day are appended to the top of the journal (below roadmaps of course).
4. If you see a entries for the day already logged by a different model or from a different workspace, create a subheading as `### Model - Workspace` for your entries under the same date heading.
5. Use the following tags (preceding the reflection) to categorize your entry:
  - `#shomos_preferences`: For newly learned preferences about the user's aesthetic, workflow, vision or technical choices.
  - `#hurdles`: For strong hurdles faced during implementation, along with chosen workarounds and decisions. ONLY reflect on strong hurdles, not for every little problem you solve. 
  - `#work_context`: For maintaining the evolving context of the work (current branch, active tasks, etc.).
6. Do NOT use these tags as markdown headings. They are purely inline hashtags.
7. Keep your reflections crisp and strictly limited to these categories. Do not write extra conversational filler.

