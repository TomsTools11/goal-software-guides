# Claude Cowork - Complete Guide Content

## What is Claude Cowork?
Cowork uses the same agentic architecture that powers Claude Code, now accessible within Claude Desktop and without opening the terminal. Instead of responding to prompts one at a time, Claude can take on complex, multi-step tasks and execute them on your behalf.

With Cowork, you can describe an outcome, step away, and come back to finished work—formatted documents, organized files, synthesized research, and more. With the introduction of scheduled tasks, Claude can complete work for you automatically.

## Availability
- Available as a research preview for paid plans: Pro, Max, Team, Enterprise
- Claude Desktop for macOS
- Claude Desktop for Windows (x64 only — arm64 not supported)
- NOT available on web or mobile

## Key Capabilities
1. **Direct local file access** – Claude can read from and write to your local files without manual uploads or downloads.
2. **Sub-agent coordination** – Claude breaks complex work into smaller tasks and coordinates parallel workstreams.
3. **Professional outputs** – Generate polished deliverables like Excel spreadsheets with working formulas, PowerPoint presentations, and formatted documents.
4. **Long-running tasks** – Work on complex tasks for extended periods without conversation timeouts or context limits.
5. **Scheduled tasks** – Create and save tasks that run on-demand or automatically on a cadence.

## How Cowork Runs Your Tasks
When you start a task in Cowork, Claude:
1. Analyzes your request and creates a plan.
2. Breaks complex work into subtasks when needed.
3. Executes work in a virtual machine (VM) environment.
4. Coordinates multiple workstreams in parallel if appropriate.
5. Delivers finished outputs directly to your file system.

You maintain visibility into what Claude is planning and doing throughout the process.

## Getting Started - Requirements
- Claude Desktop app (macOS or Windows) — NOT available on web or mobile
- Paid Claude subscription (Pro, Max, Team, Enterprise)
- Active internet connection throughout the session

## Step-by-Step Setup
1. Search "download Claude desktop app" in any browser
2. Install and sign in
3. Open Claude Desktop
4. Look for the mode selector with "Chat" and "Cowork" tabs
5. Click the "Cowork" tab to switch to "Tasks" mode
6. Use the folder icon to point Claude at a specific folder on your computer
7. Grant permissions: "Allow once" or "Always allow"
8. Describe the task you want Claude to complete
9. Review Claude's approach, then let it run

**Note:** The Claude Desktop app must remain open while Claude is working.

**Model recommendation:** Always choose the most capable model (Opus). Only drop down if you need an immediate response.

## What to Expect During a Task
- **Progress indicators** show what Claude is doing at each step
- **Transparency** – Claude surfaces its reasoning and approach so you can follow along
- **Steering** – You can jump in to course-correct or provide additional direction mid-task
- **Parallel work** – For complex tasks, Claude may coordinate multiple sub-agents simultaneously
- **Deletion protection** – Claude requires explicit permission before permanently deleting any files

## Global and Folder Instructions
### Global Instructions
Standing instructions that apply to every Cowork session. Use to specify preferred tone, output format, or background on your role.
- Navigate to Settings > Cowork within Claude Desktop
- Click "Edit" next to Global instructions
- Type your instructions and click "Save"

### Folder Instructions
Project-specific context when you select a local folder. Claude can also update these on its own during a session.

## Cowork Plugins
Plugins customize how Claude works for your role, team, and company. Each one bundles:
- Skills
- Connectors
- Slash commands
- Sub-agents
...into a single package.

## Scheduling Recurring Tasks
- Type /schedule in any Cowork task
- Click "Scheduled" in the left sidebar to view, create, and manage scheduled tasks
- Scheduled tasks only run while your computer is awake and the Claude Desktop app is open

## Excel and PowerPoint Integration (Research Preview)
- Claude can open, edit, and pass context between Excel and PowerPoint Office add-ins
- Example: Analyze data in Excel and move a chart directly into a presentation
- Requirements: Mac users on Max, Team, or Enterprise plans; both add-ins must be installed
- Windows support not yet available

## Real-World Use Cases (from Forbes/Allie K. Miller)

### Analyze Entire Folders of Documents
- Point Claude at 321 podcast transcripts → categorize guests, rank AI sentiment, pull quotes → interactive filterable dashboard
- Works for: customer call transcripts, survey responses, support tickets, competitor research, proposals, quarterly reports

### Research, Compare and Book Things
- Ask Claude to find podcast studios, compare them, create a spreadsheet, begin filling out booking forms
- Works for: supplier comparisons, software evaluations, venue scouting, event registration, market research

### Build Interactive Dashboards and Reports
- Claude creates filterable dashboards with categories, sentiment scores, job titles, sample quotes
- Output: interactive JSX file → can be ported to HTML artifact → deployed via Vercel

### Run Multiple Projects Simultaneously
- Open as many threads as needed
- One thread analyzes data, another researches a market, a third builds a presentation
- Stack follow-up instructions while Claude is still working
- "I can walk away from my computer for hours while all of these threads are managing all of these stacked up tasks"

### Hand Off Outputs to Your Team
- Download any app or program Claude creates
- Move files into VS Code, hand to an engineer, or connect to Vercel for deployment
- Claude builds the first version; your team finishes it

## Usage Limits
- Cowork consumes more usage allocation than chatting (compute-intensive, more tokens)
- Tips to manage limits:
  - Batch related work into single sessions
  - Use standard chat for simpler tasks that don't require file access
  - Monitor individual usage in Settings > Usage

## Permissions and Security
- Cowork runs directly on your computer
- Code runs safely in an isolated space, but Claude can make real changes to your files
- Cowork stores conversation history locally — not subject to Anthropic's data retention timeframe
- Cowork activity is NOT captured in Audit Logs, Compliance API, or Data Exports
- Do NOT use Cowork for regulated workloads

## Current Limitations
- Desktop app must remain open during tasks
- Scheduled tasks only run while computer is awake
- Excel/PowerPoint integration Mac-only (research preview)
- Windows arm64 not supported
- Not available on web or mobile

## Best Practices
1. Always use the most capable model (Opus) for best results
2. Point Claude at specific folders rather than your entire drive
3. Use "Always allow" for folders you're comfortable with Claude accessing freely
4. Stack follow-up instructions while Claude is working — don't wait for it to finish
5. Set global instructions to define your role, preferred tone, and output format
6. Run multiple threads simultaneously for maximum productivity
7. Use Cowork for complex, multi-step work; use Chat for simple Q&A
8. Batch related tasks into single sessions to manage usage limits
9. Review Claude's plan before letting it run on sensitive files
10. Deploy outputs via Vercel or hand off to your engineering team
