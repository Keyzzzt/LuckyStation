export const getGoogleOAuthURL = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

  const options = {
    redirect_uri: 'http://localhost:5000/api/auth/google' as string,
    client_id: '194487912642-cpm66l0kq1jl47hdrtg12c0oi040bqnu.apps.googleusercontent.com' as string,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(' '),
  }

  const qs = new URLSearchParams(options)

  return `${rootUrl}?${qs.toString()}`
}
