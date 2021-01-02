import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'
import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Save(props, { navigation }) {
    const [caption, setCaption] = useState("")

    const uploadImage = async () => {
        const uri = props.route.params.image;
        
        const response = await fetch(uri);
        const blob = await response.blob();

        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
        const task = firebase.storage().ref().child(childPath).put(blob);

        // functions to check the status of sending to firebase storage
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`);
        }

        const taskComplete = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot);
            })
        }

        const taskError = snapshot => {
            console.log(snapshot);
        }

        task.on("state_changed", taskProgress, taskError, taskComplete)
    }

    const savePostData = (downloadUrl) => {
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadUrl,
                caption,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                navigation.popToTop()
            }))

    }
    return (
        <View style={{ flex: 1 }}>
            <Image source={{uri: props.route.params.image}}/>
            <TextInput
                placeholder="Enter a caption..."
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button title="Post"onPress={() => uploadImage()}/>
        </View>
    )
}
