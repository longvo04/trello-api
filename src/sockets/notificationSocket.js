export const boardInvitationSocket = (socket) => {
  socket.on('FE_INVITATION_SENT_TO_USER', (invitation) => {
    socket.broadcast.emit('BE_INVITATION_SENT_TO_USER', invitation)
  })
}
