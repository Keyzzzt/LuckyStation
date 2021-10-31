router.post('/refresh', bodyParser(), async (ctx) => {
  const { refreshToken } = ctx.request.body
  const dbToken = await refreshTokenService.find({ token: refreshToken })
  if (!dbToken) {
    return
  }
  await refreshTokenService.remove({
    token: refreshToken,
  })
  ctx.body = await issueTokenPair(dbToken.userId)
})

router.post('/logout', jwtMiddleware({ secret: config.secret }), async (ctx) => {
  const { id: userId } = ctx.state.user
  await refreshTokenService.remove({
    userId,
  })
  ctx.body = { success: true }
})

module.exports = router
