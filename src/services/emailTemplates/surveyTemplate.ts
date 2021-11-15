import { SurveyType } from '@src/Types'

export const surveyTemplate = (survey: SurveyType) => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>${survey.title}</h3>
          <p>${survey.subject}</p>
          <p>${survey.body}</p>
          <div>
            <a href="http://localhost:3000">Yes</a>
          </div>
          <div>
            <a href="http://localhost:3000">No</a>
          </div>
        </div>
      </body>
    </html>
  `
}
