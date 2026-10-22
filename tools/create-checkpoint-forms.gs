/**
 * S&E Lab Onboarding – checkpoint quiz builder
 *
 * Creates the 7 module checkpoint quizzes as Google Forms in quiz mode,
 * puts them in a Drive folder, links all responses to one results spreadsheet,
 * and logs the short links in the format of _variables.yml.
 *
 * How to run:
 *   1. Go to https://script.google.com and click "New project".
 *   2. Delete the default code, paste this whole file, and save.
 *   3. Select the function "createCheckpointForms" and click Run.
 *   4. Approve the permissions (Forms, Drive, Sheets) the first time.
 *   5. Open "Execution log": copy the printed "forms:" block into _variables.yml.
 *
 * Running it again creates a second, separate set of forms.
 * To change questions later, edit the forms directly in Google Forms.
 */

const FOLDER_NAME = 'S&E Onboarding checkpoints';
const RESULTS_NAME = 'S&E Onboarding checkpoint results';
const PASS_TEXT = 'Pass mark: 7 of 8 points (80%). You can retake the quiz as many times as you need.';

// Each question: q = text, options = choices, correct = indices of correct options (0-based),
// more than one index makes it a "select all that apply" question; fb = feedback shown for a wrong answer.
const MODULES = [
  {
    key: 'm1',
    title: 'Module 1 – Lab culture',
    questions: [
      { q: 'A lab meeting starts in 2 minutes and you will be about 10 minutes late. What do you do?',
        options: ['Join when you can; 10 minutes is not a big deal', 'Send a short message to the meeting participants now that you will be late', 'Skip the meeting and read the notes later'],
        correct: [1], fb: 'Being more than 5 minutes late should be communicated, preferably in advance.' },
      { q: 'You have a question about the coding scheme of your project. Where do you ask it?',
        options: ['In the project channel on Slack', 'In a direct message to one team member', 'In #general', 'In #random'],
        correct: [0], fb: 'Project matters go to the project channel, so everyone stays in the loop. Direct messages are for personal issues.' },
      { q: 'A project channel has one member who does not speak Hungarian. Which language do you use there?',
        options: ['Hungarian, since most members are Hungarian', 'English', 'Either, depending on the topic'],
        correct: [1], fb: 'The communication language is English. Hungarian is only fine when all contributors are Hungarian.' },
      { q: 'You uploaded the cleaned dataset to the project folder. Which of these are still needed before the task counts as done? Select all that apply.',
        options: ['Check that the cleaning is correct and complete', 'Write a ClickUp comment saying it is done, with a link to the file', 'Mark the task complete in ClickUp', 'Wait for the next lab meeting to announce it'],
        correct: [0, 1, 2], fb: 'Definition of done: completed as described, verified, communicated in writing with a findable output, and marked complete.' },
      { q: 'You are asked to estimate a deadline for a large literature review. What is the best approach?',
        options: ['Pick a date that sounds ambitious', 'Break it into smaller subtasks and estimate the time for each', 'Ask for as much time as possible to be safe'],
        correct: [1], fb: 'Realistic deadlines come from breaking large tasks into pieces and estimating each one.' },
      { q: 'You hit an R error you do not understand. What should you try before asking a lab member?',
        options: ['Nothing, ask right away', 'Search the web and ask a generative AI assistant', 'Wait until the next lab meeting'],
        correct: [1], fb: 'Search and generative AI come first. If you are still stuck after that, ask for help, and do not stay stuck for long.' },
      { q: 'Personal problems are making it hard for you to keep up with lab work. Which of these is a good option?',
        options: ['Quietly stop working until things get better', 'Talk to the Faculty counseling service, which is free, and let your supervisor know your capacity has changed', 'Keep it to yourself and miss deadlines'],
        correct: [1], fb: 'You can talk to a counselor for free, and changes in what you can deliver should be communicated.' },
      { q: 'You need a letter of recommendation from a lecturer. What is the usual approach?',
        options: ['Wait for the lecturer to offer one', 'Contact them yourself and prepare everything so they can reply quickly', 'Ask a classmate to ask for you'],
        correct: [1], fb: 'Seek out the person yourself and prepare the materials so a quick reply is possible (see the Letter of recommendation guide).' }
    ]
  },
  {
    key: 'm2',
    title: 'Module 2 – Tools setup',
    questions: [
      { q: 'Where should you write the first draft of a questionnaire for a lab project?',
        options: ['In a Word file on your laptop', 'In a Google Doc in the project\'s shared Drive folder', 'In a Slack message'],
        correct: [1], fb: 'We use online documents only, stored in the cloud where the team can access them.' },
      { q: 'Which platform keeps all files of a research project together and is used to publish data and materials?',
        options: ['Google Drive', 'OSF', 'Slack', 'ClickUp'],
        correct: [1], fb: 'OSF holds all research project files and is where we publish data and materials.' },
      { q: 'You need to find a time for a meeting with five people. What does the lab usually use?',
        options: ['A long Slack thread', 'Doodle linked to your Google Calendar', 'Email back and forth'],
        correct: [1], fb: 'For group meetings we often use Doodle, linked to Google Calendar.' },
      { q: 'What is the default format of lab meetings?',
        options: ['In person in the lab', 'Online in Google Meet', 'Online in MS Teams'],
        correct: [1], fb: 'Meetings are online in Google Meet by default; in-person meetings are the exception.' },
      { q: 'Which reference managers are acceptable for lab manuscripts? Select all that apply.',
        options: ['Paperpile', 'Zotero', 'Mendeley', 'A carefully typed reference list'],
        correct: [0, 1, 2], fb: 'Paperpile is our primary reference manager; Zotero and Mendeley are free alternatives. Handmade reference lists are not acceptable.' },
      { q: 'Where do you check who is responsible for a task and when it is due?',
        options: ['Slack', 'ClickUp', 'Google Calendar only'],
        correct: [1], fb: 'ClickUp tracks tasks, responsible people, dependencies and deadlines.' },
      { q: 'You need a university licence for a piece of software. Where do you look?',
        options: ['The ELTE IIG software distribution site', 'Ask a classmate for their licence key', 'Buy it yourself'],
        correct: [0], fb: 'University software licences are on the ELTE IIG site.' },
      { q: 'An external collaborator needs a general contact address for the lab. Which one do you give?',
        options: ['Your personal email', 'The lab account: stress.and.emotions.lab@gmail.com', 'The Slack workspace link'],
        correct: [1], fb: 'The lab has a shared email account for external communication.' }
    ]
  },
  {
    key: 'm3',
    title: 'Module 3 – Ethics, privacy and data security',
    questions: [
      { q: 'Who can submit an ethics application for a lab study?',
        options: ['Any lab member', 'The student running the study', 'Only the head of the lab'],
        correct: [2], fb: 'Ethics applications can only be submitted by the head of the lab.' },
      { q: 'The pilot went well and participants are available. The ethics permission has not arrived yet. Can you start data collection?',
        options: ['Yes, if the supervisor is present', 'Yes, but only with a few participants', 'No, data collection requires the ethics permission first'],
        correct: [2], fb: 'All data collection requires ethics permission from the university, including student projects.' },
      { q: 'A co-author asks for your Google password so they can open a project file quickly. What do you do?',
        options: ['Give it to them; they are on the project', 'Share the file with their own Google account instead', 'Send the file as an email attachment'],
        correct: [1], fb: 'Keep passwords secret and share documents with each person\'s own account, so the event log stays accurate.' },
      { q: 'You must open a lab document on a library computer. What is the safest way?',
        options: ['Log in normally and stay logged in for next time', 'Use an incognito window and log out when you are done', 'Save the password in the browser'],
        correct: [1], fb: 'Avoid logging in on other computers. If you have no choice, use incognito mode (Ctrl+Shift+N in Chrome) and log out.' },
      { q: 'When must the ownership of key project files be transferred to the lab account?',
        options: ['When the paper is published', 'As soon as data collection starts', 'When the student leaves the lab'],
        correct: [1], fb: 'Ownership is transferred as soon as data collection starts.' },
      { q: 'Why are key files owned by the lab account?',
        options: ['So the lab keeps access after students leave', 'To save storage space', 'Because students may not own files'],
        correct: [0], fb: 'Files are often needed years later; the lab must keep access after people leave.' },
      { q: 'Which of these may be made public? Select all that apply.',
        options: ['A fully anonymized dataset', 'The analysis code', 'Raw video recordings of participants', 'The list of participants\' email addresses'],
        correct: [0, 1], fb: 'Only anonymized data (and materials such as code) can be made public. Non-anonymized data and private participant information are never shared.' },
      { q: 'You leave a project after your BA thesis. What happens to your access to its files?',
        options: ['You keep it permanently', 'Your permissions are removed', 'You keep read-only access'],
        correct: [1], fb: 'Permissions are removed upon leaving the project.' }
    ]
  },
  {
    key: 'm4',
    title: 'Module 4 – Running a study',
    questions: [
      { q: 'What is the correct order?',
        options: ['Data collection → pre-registration → ethics permission', 'Ethics application → pre-registration → data collection', 'Pre-registration → data collection → ethics application'],
        correct: [1], fb: 'Ethics application, then pre-registration on OSF, then data collection.' },
      { q: 'How are participants scheduled for in-person lab sessions?',
        options: ['youcanbook.me', 'Doodle', 'Slack messages'],
        correct: [0], fb: 'Lab sessions are booked through youcanbook.me.' },
      { q: 'Which of these belong in a lab log entry? Select all that apply.',
        options: ['Date and session number', 'Participant ID', 'What happened and what you did', 'The participant\'s full name'],
        correct: [0, 1, 2], fb: 'Log the date, session, participant ID and events. Never write participant names in the log.' },
      { q: 'A participant asks to skip one questionnaire. What do you do?',
        options: ['Allow it quietly, it is only one questionnaire', 'Follow the protocol and supervisor\'s instructions, and record it in the lab log', 'Insist they complete it'],
        correct: [1], fb: 'Follow the research protocol and your supervisor, respect the participant, and record every irregular event in the lab log.' },
      { q: 'A participant used the lab headphones. What do you do before the next session?',
        options: ['Nothing, unless they look dirty', 'Clean them', 'Replace them with new ones'],
        correct: [1], fb: 'Always clean equipment that a participant used.' },
      { q: 'The analysis code of a study is written in R. Where does it live?',
        options: ['In a GitHub repository embedded in the OSF project', 'In the Google Drive folder only', 'On the analyst\'s laptop'],
        correct: [0], fb: 'R analysis code goes in a GitHub repository, embedded in the study\'s OSF project.' },
      { q: 'Can you run data collection sessions without supervision once you have done a few?',
        options: ['Yes, after the first three sessions', 'No, data collection is only done with supervision', 'Yes, if the protocol is printed out'],
        correct: [1], fb: 'Data collection can only be done with supervision.' },
      { q: 'Which documents does an in-person lab study need on top of the usual ones? Select all that apply.',
        options: ['A detailed research protocol', 'A lab log of every session and event', 'A press release'],
        correct: [0, 1], fb: 'In-person studies need a research protocol and a lab log.' }
    ]
  },
  {
    key: 'm5',
    title: 'Module 5 – Writing',
    questions: [
      { q: 'A co-author sends you a .docx draft. Where do you continue working on it?',
        options: ['In Word, on your laptop', 'In Google Docs', 'Either, it does not matter'],
        correct: [1], fb: 'We work in Google Docs, even when the final file needs to be a .docx.' },
      { q: 'In which language do you write comments and suggestions in a lab manuscript?',
        options: ['Hungarian', 'English', 'Whichever the author prefers'],
        correct: [1], fb: 'All suggestions and comments are in English.' },
      { q: 'You want to include a results table from R. How?',
        options: ['As a screenshot image', 'As a real table in the document', 'As an appendix at the end'],
        correct: [1], fb: 'Tables are included as tables, not images, and placed in the text.' },
      { q: 'Which file name follows the lab\'s rules?',
        options: ['thesis210210_final_ver2.docx', 'Tactile sensitivity and arousal manuscript', 'manuscript (3)', 'Új dokumentum'],
        correct: [1], fb: 'One file per document, with a name that identifies the topic and has no confusing characters.' },
      { q: 'You want to use a long passage from a paper to describe a theory. What should you do?',
        options: ['Quote the whole passage', 'Paraphrase it in your own words and cite the source', 'Copy it without quotation marks if you cite the paper'],
        correct: [1], fb: 'Use direct quotes only for definitions or idioms; avoid long verbatim passages, and always reference ideas.' },
      { q: 'You reuse two paragraphs from your own earlier published paper without citing it. Is that acceptable?',
        options: ['Yes, it is your own text', 'No, it is self-plagiarism', 'Yes, if it is less than a page'],
        correct: [1], fb: 'Self-plagiarism is also forbidden.' },
      { q: 'You use an AI assistant to translate your abstract into English. Which statement is correct?',
        options: ['Not allowed in the lab', 'Allowed, but you double-check the result and follow the Faculty\'s AI guideline', 'Allowed, and no checking is needed for translations'],
        correct: [1], fb: 'Generative AI is welcome when used responsibly: always double-check its output and follow the Faculty guideline.' },
      { q: 'How should headings be formatted in a lab document?',
        options: ['Bold and a larger font size', 'With the heading styles of the template', 'Underlined capitals'],
        correct: [1], fb: 'No manual font changes; use heading styles, which also create the document outline.' }
    ]
  },
  {
    key: 'm6',
    title: 'Module 6 – Data and R',
    questions: [
      { q: 'Your data cannot go into Google Sheets. Which file format is preferred?',
        options: ['.xlsx', '.csv or .tsv', '.sav'],
        correct: [1], fb: 'Use Google Sheets when possible, otherwise .tsv or .csv rather than .xlsx.' },
      { q: 'Which is a valid participant ID in a lab dataset?',
        options: ['ab12345 (a Neptun code)', 'TS042', 'Kiss Péter', '42'],
        correct: [1], fb: 'IDs mix letters and zero-padded numbers, with no special or accented characters, and are never personal identifiers.' },
      { q: 'Which variable name follows the lab\'s conventions?',
        options: ['Stressz szint (1-7)', 'stress_level', 'V12', 'StressLevel!!'],
        correct: [1], fb: 'Variable names are in English and readable by both humans and computers.' },
      { q: 'Which statistical method must every lab member know fairly well?',
        options: ['ANOVA', '(Generalized) linear regression', 'Structural equation modeling'],
        correct: [1], fb: '(Generalized) linear regression is the starting point; mixed-effects models come next.' },
      { q: 'What should you learn as soon as possible after linear regression?',
        options: ['Linear mixed-effects (multilevel) models', 'Factor analysis', 'Machine learning'],
        correct: [0], fb: 'Linear mixed-effects modeling (multilevel regression) is the next step.' },
      { q: 'You cannot use R yet. Which tools are fine for your analysis? Select all that apply.',
        options: ['JASP', 'jamovi', 'SPSS'],
        correct: [0, 1], fb: 'If you cannot use R, use JASP or jamovi. The lab does not work with SPSS.' },
      { q: 'How is an R analysis organized in the lab?',
        options: ['A single script emailed to the supervisor', 'An R Project under git version control, pushed to GitHub', 'Code pasted into a Google Doc'],
        correct: [1], fb: 'Every project uses an R Project, with git and GitHub for version control.' },
      { q: 'What format do analysis reports have?',
        options: ['A Word document with copied output', 'Quarto or R Markdown compiled to HTML', 'Screenshots in a slide deck'],
        correct: [1], fb: 'Analysis reports are written in Quarto or Rmd and compiled into HTML.' }
    ]
  },
  {
    key: 'm7',
    title: 'Module 7 – Publishing',
    questions: [
      { q: 'When are authorship and author order discussed?',
        options: ['After acceptance', 'In advance', 'When submitting the manuscript'],
        correct: [1], fb: 'Authorship and preferred author position should be discussed in advance.' },
      { q: 'Who qualifies for authorship? Select all that apply.',
        options: ['Lab members with a continuous creative contribution to the project', 'People who take an active part in the writing process', 'The head of the department, by default', 'Anyone who ran at least one session'],
        correct: [0, 1], fb: 'Authorship requires continuous creative contribution and active participation in writing. Honorary authorship is not allowed.' },
      { q: 'A senior colleague who was not involved asks to be added as an author. What is the lab\'s rule?',
        options: ['Add them as last author', 'Honorary and guest authorships are not allowed', 'Add them if the journal allows it'],
        correct: [1], fb: 'Honorary and guest authorships are not allowed.' },
      { q: 'Which tool does the lab use to record contributorship details?',
        options: ['tenzing (CRediT roles)', 'ClickUp', 'A Slack poll'],
        correct: [0], fb: 'We use the tenzing app, based on the CRediT taxonomy.' },
      { q: 'You cite a friend\'s papers mainly to increase their citation count. Is this acceptable?',
        options: ['Yes, everyone does it', 'No, it is a questionable practice', 'Only if the papers are recent'],
        correct: [1], fb: 'Citing friends or journals just to inflate citation counts is not acceptable.' },
      { q: 'As a reviewer, when is it acceptable to suggest your own work?',
        options: ['Always, reviewers deserve citations', 'Only when it is genuinely relevant, for a proper reason', 'Never'],
        correct: [1], fb: 'Asking authors to cite your own work without a proper reason is not ethical.' },
      { q: 'You receive a harsh review. What is the best first step?',
        options: ['Reply right away while the arguments are fresh', 'Take your time, then respond politely and patiently', 'Withdraw the paper'],
        correct: [1], fb: 'The first reading can feel insulting; take your time, and respond politely, without getting defensive.' },
      { q: 'What attitude should your response letter take?',
        options: ['Defend every point of the original manuscript', 'Treat the review as feedback that improves the work', 'Reply only to comments you agree with'],
        correct: [1], fb: 'The general attitude is that reviews are feedback you use to improve your work.' }
    ]
  }
];

function createCheckpointForms() {
  const folder = getOrCreateFolder_(FOLDER_NAME);
  const results = SpreadsheetApp.create(RESULTS_NAME);
  moveToFolder_(results.getId(), folder);

  const lines = ['forms:'];
  MODULES.forEach(function (mod) {
    const form = FormApp.create('S&E Onboarding – ' + mod.title + ' checkpoint');
    form.setIsQuiz(true)
      .setDescription(PASS_TEXT)
      .setLimitOneResponsePerUser(false)
      .setAllowResponseEdits(false)
      .setShowLinkToRespondAgain(true)
      .setPublishingSummary(false)
      .setProgressBar(true);
    try {
      form.setEmailCollectionType(FormApp.EmailCollectionType.VERIFIED);
    } catch (e) {
      form.setCollectEmail(true);
    }

    mod.questions.forEach(function (item) {
      const multi = item.correct.length > 1;
      const question = multi ? form.addCheckboxItem() : form.addMultipleChoiceItem();
      question.setTitle(item.q).setRequired(true).setPoints(1);
      if (multi) question.setHelpText('Select all that apply.');
      question.setChoices(item.options.map(function (text, i) {
        return question.createChoice(text, item.correct.indexOf(i) !== -1);
      }));
      if (item.fb) {
        question.setFeedbackForIncorrect(FormApp.createFeedback().setText(item.fb).build());
      }
    });

    form.setDestination(FormApp.DestinationType.SPREADSHEET, results.getId());
    moveToFolder_(form.getId(), folder);

    const url = form.shortenFormUrl(form.getPublishedUrl());
    lines.push('  ' + mod.key + ': "' + url + '"');
    Logger.log(mod.title + ' – edit: ' + form.getEditUrl());
  });

  Logger.log('\nPaste this into _variables.yml (replacing the forms: block):\n\n' + lines.join('\n'));
  Logger.log('\nResults spreadsheet: ' + results.getUrl());
  Logger.log('Folder: ' + folder.getUrl());
}

function getOrCreateFolder_(name) {
  const existing = DriveApp.getFoldersByName(name);
  return existing.hasNext() ? existing.next() : DriveApp.createFolder(name);
}

function moveToFolder_(fileId, folder) {
  DriveApp.getFileById(fileId).moveTo(folder);
}
