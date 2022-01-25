$(document).ready(function () {
    $("#salir").hide();
    $("#borrar").hide();
    $("#contenido").hide();

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyDWjaFczFEXiwOXOHjzDOgEfOE6qwd6gJ8",
        authDomain: "fir-app-84d1c.firebaseapp.com",
        projectId: "fir-app-84d1c",
        storageBucket: "fir-app-84d1c.appspot.com",
        messagingSenderId: "215076137744",
        appId: "1:215076137744:web:c5ae8c4ee5bee03a391395",
        measurementId: "G-VR1QQZKK7N"
    };
    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    console.log(app);

    // Initialize Firebase-auth
    const auth = firebase.auth();

    // Initialize Firebase-Firestore
    const db = firebase.firestore();

    $("#registrar").on("click", function (e) {
        e.preventDefault();
        var correo = $("#exampleInputEmail1").val();
        var contraseña = $("#exampleInputPassword1").val();
        $("#registro").trigger("reset");

        auth.createUserWithEmailAndPassword(correo, contraseña)
            .then((userCredential) => {
                // Signed in
                $("#registro").trigger("reset");
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
            });

    });

    $("#iniciar").on("click", function (e) {
        e.preventDefault();
        var correo = $("#exampleInputEmail1").val();
        var contraseña = $("#exampleInputPassword1").val();
        $("#registro").trigger("reset");

        auth.signInWithEmailAndPassword(correo, contraseña)
            .then((userCredential) => {
                // Signed in
                /*alert("Inicio de sesión adecuado");*/
                $("#presentacion").hide();
                $("#salir").show();
                $("#contenido").show();
                $("#borrar").show();
                MostrarPost();
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert("Inicio de sesión fallido");
            });

    });

    //Boton para cerrar sesión
    $("#salir").on("click", function (e) {
        e.preventDefault();
        auth.signOut().then(() => {
            // Sign-out successful.
            /*alert("Cierre de sesión adecuado");*/
            $("#presentacion").show();
            $("#salir").hide();
            $("#contenido").hide();
            $("#borrar").show();
        }).catch((error) => {
            // An error happened.
        });
    });

    //Boton para eliminar cuenta, después de haber iniciado sesión
    $("#borrar").on("click", function (e) {
        e.preventDefault();
        const user = auth.currentUser;

        user.delete().then(() => {
            alert("Cuenta eliminada con éxito");
            $("#presentacion").show();
            $("#salir").hide();
            $("#contenido").hide();
            $("#borrar").show();
            // User deleted.
        }).catch((error) => {
            // An error ocurred
            // ...
        });
    });

    //Boton para iniciar con Google
    $("#iniciar-google").on("click", function (e) {
        e.preventDefault();
        var provider = new firebase.auth.GoogleAuthProvider();
        auth
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // ...

                alert("Inicio de sesión con google adecuado");
                $("#presentacion").hide();
                $("#salir").show();
                $("#contenido").show();
                $("#borrar").show();
                MostrarPost();
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
    });

    //Boton para iniciar con FAcebook
    $("#iniciar-facebook").on("click", function (e) {
        e.preventDefault();
        var provider = new firebase.auth.FacebookAuthProvider();

        auth
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // The signed-in user info.
                var user = result.user;

                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var accessToken = credential.accessToken;

                // ...
                alert("Inicio de sesión con facebook adecuado");
                $("#presentacion").hide();
                $("#salir").show();
                $("#contenido").show();
                $("#borrar").show();
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;

                // ...
            });
    });

    $("#postear").on("click", function (e) {
        e.preventDefault();
        var imagen = $("#imagen-postear").val();
        var comentario = $("#comentario-postear").val();

        /*Agregamos datos a la base de datos */
        db.collection("posts").add({
            imagen: imagen,
            comentario: comentario,
        })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                alert("Se subió correctamente a la base");
                $("#form-post").trigger("reset");
                MostrarPost();
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    });

    function MostrarPost() {
        db.collection("posts").get().then((querySnapshot) => {
            $("#posteos").empty();
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.data().imagen);
                $("#posteos").append(`<div class="card text-start my-5" style="width: 50rem;">
                <img
                  src="${doc.data().imagen}"
                  class="card-img-top" alt="...">
                <div class="card-body">
                  <p class="card-text">${doc.data().comentario}</p>
                </div>
              </div>`);
            });
        });
    }
});



