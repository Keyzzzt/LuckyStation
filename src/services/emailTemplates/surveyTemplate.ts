// import { SurveyType } from '@src/Types'

export const surveyTemplate = (survey) => {
  return `
    <html>
    <style>
    </style>
      <body style="background-color: #09c; border: 1px solid blue;">
        <div style="text-align: center;">
          <h3>${survey.title}</h3>
          <p>${survey.subject}</p>
          <p>${survey.body}</p>
          <div>
            <a href=${process.env.sendgrid_question_domain}/api/survey/${survey.id}/yes>Yes</a>
          </div>
          <div>
            <a href=${process.env.sendgrid_question_domain}/api/survey/${survey.id}/no>No</a>
          </div>
        </div>
      </body>
    </html>
  `
}
