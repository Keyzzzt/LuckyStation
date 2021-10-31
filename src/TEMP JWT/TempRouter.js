router.post('/logout', jwtMiddleware({ secret: config.secret }), async (ctx) => {
  const { id: userId } = ctx.state.user
  await refreshTokenService.remove({
    userId,
  })
  ctx.body = { success: true }
})

module.exports = router
