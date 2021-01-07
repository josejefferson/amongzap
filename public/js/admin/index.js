const $logs = document.querySelector('.logs')
const $onlineUsersCount = document.querySelector('.onlineUsersCount')
const $userHistoryCount = document.querySelector('.userHistoryCount')
const $messagesCount = document.querySelector('.messagesCount')
const $typingUsersCount = document.querySelector('.typingUsersCount')
const $bannedUsersCount = document.querySelector('.bannedUsersCount')
// importante verificar se existe linhas selecionadas antes de atualizar (colocar botão para atualizar)
let onlineUsers = []
let userHistory = []
let messages = []
let typingUsers = []
let bannedUsers = []
let logs = []