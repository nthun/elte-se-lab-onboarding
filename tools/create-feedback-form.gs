/**
 * S&E Lab Onboarding – anonymous feedback form
 *
 * Creates one anonymous Google Form (no email collection) for newcomers to
 * fill in at the end of onboarding, puts it in the "S&E Onboarding checkpoints"
 * folder, and sends responses to a "Feedback" tab of the checkpoint results
 * spreadsheet.
 *
 * How to run:
 *   1. Open your Apps Script project (the one with createCheckpointForms).
 *   2. Click + next to "Files" → Script, name it "feedback", paste this whole file, save.
 *   3. Select "createFeedbackForm" in the function dropdown and click Run.
 *   4. Copy the "feedback:" line from the Execution log and send it to Claude
 *      (or add it under "forms:" in _variables.yml yourself).
 */

function createFeedbackForm() {
  const MODULE_ROWS = [
    '1. Lab culture',
    '2. Tools setup',
    '3. Ethics, privacy and data security',
    '4. Running a study',
    '5. Writing',
    '6. Data and R',
    '7. Publishing'
  ];

  const form = FormApp.create('S&E Onboarding – feedback');
  form.setDescription(
    'Thanks for finishing the onboarding! This form is anonymous: we do not collect your name or email. ' +
    'Your answers help us make the course better for the next newcomers. It takes about 5 minutes.'
  )
    .setCollectEmail(false)
    .setLimitOneResponsePerUser(false)
    .setAllowResponseEdits(false)
    .setPublishingSummary(false)
    .setConfirmationMessage('Thank you! Your feedback helps the next cohort.');
  try {
    form.setEmailCollectionType(FormApp.EmailCollectionType.DO_NOT_COLLECT);
  } catch (e) { /* older API: setCollectEmail(false) above is enough */ }

  form.addMultipleChoiceItem()
    .setTitle('Which track did you follow?')
    .setChoiceValues(['BA track (modules 1–5 and the data part of 6)', 'Full course', 'Something else'])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('Overall, how useful was the onboarding course?')
    .setBounds(1, 5)
    .setLabels('Not useful', 'Very useful')
    .setRequired(true);

  form.addGridItem()
    .setTitle('How useful was each module?')
    .setRows(MODULE_ROWS)
    .setColumns(['Very useful', 'Somewhat useful', 'Not useful', 'Skipped']);

  form.addMultipleChoiceItem()
    .setTitle('Roughly how long did the whole course take you (not counting the Coursera writing course)?')
    .setChoiceValues(['Less than 2 hours', '2–4 hours', '4–6 hours', 'More than 6 hours']);

  form.addParagraphTextItem()
    .setTitle('What was confusing or unclear?');

  form.addParagraphTextItem()
    .setTitle('What was missing? What do you wish you had known in your first weeks?');

  form.addParagraphTextItem()
    .setTitle('What was the most useful part?');

  form.addParagraphTextItem()
    .setTitle('Anything else? (outdated information, broken links, ideas)');

  // Same Drive folder and results spreadsheet as the checkpoint quizzes, if they exist
  const folders = DriveApp.getFoldersByName('S&E Onboarding checkpoints');
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder('S&E Onboarding checkpoints');
  DriveApp.getFileById(form.getId()).moveTo(folder);

  const sheets = DriveApp.getFilesByName('S&E Onboarding checkpoint results');
  const resultsId = sheets.hasNext() ? sheets.next().getId() : SpreadsheetApp.create('S&E Onboarding checkpoint results').getId();
  form.setDestination(FormApp.DestinationType.SPREADSHEET, resultsId);

  const url = form.shortenFormUrl(form.getPublishedUrl());
  Logger.log('Add this line under "forms:" in _variables.yml:\n  feedback: "' + url + '"');
  Logger.log('Edit the form: ' + form.getEditUrl());
}
