import express from 'express';
import bcrypt from 'bcrypt';

const app = express();
const saltRound = 10;

let genratedHash;

async function hashPassword(password){
    try {
        genratedHash = await bcrypt.hash(password,saltRound);
        console.log(typeof genratedHash);
        return genratedHash;
    } catch (error) {
        console.log('Error while hashing',error.stack);
    }
}

async function decodeHash(password,hash) {
    try {
        const result = await bcrypt.compare(password,hash);
        return result; //true/false
    } catch (error) {
        console.log(error);
    }
}

app.get('/',async (req,res)=>{
    const myHash = await hashPassword('myPassword');
    console.log(myHash);
    res.send(myHash);
})

app.get('/check',async(req,res)=>{
    try {
        const result = await decodeHash(genratedHash);
        console.log(result);
        res.send(result)
    } catch (error) {
        console.log(error);
    }

})

app.listen(3000);

