# ✉️WhatsApp clone by Pere Palacín
A Full Stack clone of the WhatsApp Web App created with **React** and **Node.JS** both using **TypeScript**. **Express.JS** is used to handle all the requests by the users, featuring the **Socket.io** package to send real time updates to all the online clients. **PosgreSQL** is used to store all the data. The app is not designed to be responsive. Is is deployed on Render.com at: [Whatsapp Clone by Pere Palacín](https://whatsapp-clone-by-pere-palacin.onrender.com/)
## 📦 Technologies

- `Vite`
- `React.js`
- `TypeScript`
- `Node JS`
- `Express JS`
- `SQL`
- `Socket.io`
- `CSS` 

## 🚄 Features

This Whatsapp Clone incorporates the following features:
- **Auth**: I built the Auth system using SQL to store the user credentials, Bcrypt to encrypt the user credentials and JWTokens to handle the user session both in the Frontend and the Backend without using a Third Party Provider.
- **Send private messages**: Just like in regular WhatsApp, users can send private messages to other people. Instead of taking the phone number, it takes the user's username as identifier.
- **Create group chats**: Group chats with unlimited users can be created, all of them will receive updates in real time thanks to Socket.io.
- **Protected routes**: Privacy is very important! That is why all Backend routes are protected with a Middleware script that checks if the user doing the request is authorized or not.
- **Real time notifications**: Users are notified in real time when they receive a new message, just like in the real app.
- **Insightful Error handling**: There are many things that can go wrong with a messaging app, that is why it features a rich notification system to let the user know what is going on.

## 📚 What I Learned

During this project, I've picked up important skills and a better understanding of complex ideas and workflows, which helped me build better coding practices as well as being able to design more complicated systems.

###  React `useContext`:

- Implementing many contexts within the applicationg made my understand better how to manage states within a WebApp while maintaining a clean readable codebase without much repetition and prop-drilling.

###  React Custom Hooks implementation:

- Throughout the app I've made use of plenty of custom hooks to avoid repetition and keep a clean and maintainable code for all my components.

###  Authorization and Route Protection:

- This project has been the frist one where I have implemented an Auth System by myself. helping me better understand what is happening under the hood with external Auth providers.

###  Web Sockets:
- Thanks to the use of Socket.io, I was able to implement a Web Sockets protocol to communicate clients with the server in real time without refreshing the page to create a new request.
- 
###  Error and Response handling:
- One of the main focuses of this project, was to dive deeper into handling the response from the server. This app features a rich notification system to let the user know what went wrong.

## 💭 How can it be improved?

- Make the App responsive.
- Add the sending, not read and read functionality to each message.
- Implement user's last activity details.
- Add user's status.
- Add message encryptation for additional safety.

## 🚦 Running the Project

To run the project in your local environment, follow these steps:

0. **Set up the .env file**:
```
PORT = 5000


PGHOST='Insert the credentials from your db provider here'
PGDATABASE='Insert the credentials from your db provider here'
PGUSER='Insert the credentials from your db provider here'
PGPASSWORD='Insert the credentials from your db provider here'
ENDPOINT_ID='Insert the credentials from your db provider here'

JWT_SECRET = 'Insert random string here'

NODE_ENV = development
```
1. Clone the repository to your local machine.
2. Edit the SocketContext.tsx file at the following route: ./frontend/src/context/SocketContext.tsx
```js
//Paste this inside the useEffect
if (authUser) {
const  socket  =  io("http://localhost:5000", {
query: {
userId: authUser.id,
}
});
setSocket(socket);
return () => {socket.close()};
} else {
if (socket) {
socket.close();
setSocket(null);
}
}
```
3. Edit the socket.ts file at the following route: ./backend/socket/socket.ts
```js
const  server  =  http.createServer(app);
const  io  =  new  Server(server, {
cors: {
// origin: ["http://localhost:5000"], //Uncomment this line
origin: ["https://whatsapp-clone-by-pere-palacin.onrender.com/"], //Comment this one
methods: ["GET", "POST"]
}

});
```
4. Run `npm run start` to install all the dependancies and to get the project started.
5. Open [http://localhost:5000](http://localhost:5173) (or the address shown in your console) in your web browser to view the app.

## 🍿 Video

https://youtu.be/LFqp7fKf7d8?si=91dw-vtfvIykylwv
