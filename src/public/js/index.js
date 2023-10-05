// Con este socket vamos a establecer la comunicación con nuestro servidor
const socket = io()

// Swal.fire({
//     title: "Modal de prueba",
//     text: "Mensaje inicial de prueba",
//     icon: "success"
// })
let user;
const chatBox = document.getElementById('chat-box')
const messageLogs = document.getElementById("message-logs")

// Vamos a desarrollar el modal de autenticación
Swal.fire({
    title: "Indentificación",
    input: "text",
    text: "Ingresa el usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas ingresar un nombre de usuario"
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
}).then(result => {
    user = result.value
    socket.emit("authenticated", user)
})

chatBox.addEventListener("keyup", evt => {
    if(evt.key === "Enter"){
        if(chatBox.value.trim().length > 0){
            socket.emit("message", { user, message: chatBox.value })
            chatBox.value = ""
        }
    }
})

socket.on("messageLogs", data => {
    let messages = ""
    data.forEach(message => {
        messages+= `${message.user} dice: ${message.message} </br>`
        messageLogs.innerHTML = messages
    })
})

socket.on("newUserConnected", data => {
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
        title: `${data} se ha unido al chat`,
        icon: "success"

    })
})