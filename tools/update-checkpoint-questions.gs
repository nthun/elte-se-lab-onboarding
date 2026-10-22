/**
 * S&E Lab Onboarding – update the live checkpoint quizzes (October 2026, round 2)
 *
 * Safe to run whether or not you already ran the first update: questions that
 * are already current are skipped.
 *
 * Replaces 6 outdated questions in the Module 2, 3, 4 and 6 checkpoint forms
 * (OSF projects, Doodle, Mendeley, ownership timing, ID format).
 * Form links, settings and collected responses stay as they are.
 *
 * How to run:
 *   1. Open your Apps Script project (the one with createCheckpointForms).
 *   2. Click + next to "Files" → Script, name it "update", and paste this whole file.
 *   3. Save, select "updateCheckpointQuestions2" in the function dropdown, click Run.
 *   4. The Execution log lists each updated question. Running it again is safe.
 */

const CHECKPOINT_UPDATES = [
  { form: 'S&E Onboarding – Module 2 – Tools setup checkpoint',
    oldTitle: 'Which platform keeps all files of a research project together and is used to publish data and materials?',
    q: 'Where are pre-registrations submitted?',
    options: ['Google Drive', 'OSF Registries', 'ClickUp', 'Slack'], correct: [1],
    fb: 'Pre-registrations go to OSF Registries. We no longer use OSF projects for storing files.' },
  { form: 'S&E Onboarding – Module 2 – Tools setup checkpoint',
    oldTitle: 'You need to find a time for a meeting with five people. What does the lab usually use?',
    q: 'You need to find a time for a meeting with five people. What does the lab use?',
    options: ['A long Slack thread', 'When2meet', 'Email back and forth'], correct: [1],
    fb: 'We use When2meet, and you can import your Google Calendar availability into it.' },
  { form: 'S&E Onboarding – Module 2 – Tools setup checkpoint',
    oldTitle: 'Which reference managers are acceptable for lab manuscripts? Select all that apply.',
    q: 'Which reference manager should a new lab member learn and use in their documents?',
    options: ['Zotero', 'A carefully typed reference list', 'Google Scholar\'s "Cite" button', 'No reference manager is needed'], correct: [0],
    fb: 'New members learn Zotero; it is free and works with Google Docs. Handmade reference lists are not acceptable.' },
  { form: 'S&E Onboarding – Module 3 – Ethics, privacy and data security checkpoint',
    oldTitle: 'When must the ownership of key project files be transferred to the lab account?',
    q: 'You create a new Google Doc for your project inside the project folder. Who should own it?',
    options: ['You, as the author', 'The lab account; you transfer ownership right away', 'Whoever edits it most'], correct: [1],
    fb: 'Project files are owned by the lab account by default. Google keeps you as owner of files you create, even in a lab-owned folder, so you transfer ownership yourself.' },
  { form: 'S&E Onboarding – Module 4 – Running a study checkpoint',
    oldTitle: 'The analysis code of a study is written in R. Where does it live?',
    oldOption: 'In a GitHub repository embedded in the OSF project',
    q: 'The analysis code of a study is written in R. Where does it live?',
    options: ['In a GitHub repository', 'In the Google Drive folder only', 'On the analyst\'s laptop'], correct: [0],
    fb: 'R analysis code goes in a GitHub repository.' },
  { form: 'S&E Onboarding – Module 6 – Data and R checkpoint',
    oldTitle: 'Which is a valid participant ID in a lab dataset?',
    oldOption: 'TS042',
    q: 'Which is a valid participant ID in a lab dataset?',
    options: ['ab12345 (a Neptun code)', 'SE05685678', 'Kiss Péter', '42'], correct: [1],
    fb: 'Lab IDs are "SE" plus 8 digits, created with the Participant ID template. They are never raw personal identifiers.' }
];

function updateCheckpointQuestions2() {
  CHECKPOINT_UPDATES.forEach(function (u) {
    const files = DriveApp.getFilesByName(u.form);
    if (!files.hasNext()) { Logger.log('Form not found: ' + u.form); return; }
    const form = FormApp.openById(files.next().getId());
    const items = form.getItems();
    const pos = items.findIndex(function (it) {
      if (it.getTitle() !== u.oldTitle) return false;
      if (!u.oldOption) return true;
      // same title as the new version: only replace if the old option is still there
      const choices = it.getType() === FormApp.ItemType.CHECKBOX
        ? it.asCheckboxItem().getChoices() : it.asMultipleChoiceItem().getChoices();
      return choices.some(function (c) { return c.getValue() === u.oldOption; });
    });
    if (pos === -1) { Logger.log('Already up to date: ' + u.q); return; }

    const multi = u.correct.length > 1;
    const item = multi ? form.addCheckboxItem() : form.addMultipleChoiceItem();
    item.setTitle(u.q).setRequired(true).setPoints(1);
    if (multi) item.setHelpText('Select all that apply.');
    item.setChoices(u.options.map(function (text, i) {
      return item.createChoice(text, u.correct.indexOf(i) !== -1);
    }));
    item.setFeedbackForIncorrect(FormApp.createFeedback().setText(u.fb).build());

    form.moveItem(item.getIndex(), pos);  // new question takes the old one's place
    form.deleteItem(pos + 1);             // remove the old question
    Logger.log('Updated (' + u.form + '): ' + u.q);
  });
}
