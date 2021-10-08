import './App.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail ,updateProfile} from "firebase/auth";
import initializeAuthentication from './Firebase/firebase-initialize';
import { useState } from 'react';
initializeAuthentication()

const googleProvider = new GoogleAuthProvider();
const auth = getAuth();
function App() {
  const [user, setUser] = useState({})
  // for name
  const [name,setName]=useState('')
  // for email
  const [email, setEmail] = useState('')
  // for pass 
  const [pass, setPass] = useState('')

  // pass 6 er kom hoile tar jonno state 
  const [error, setError] = useState('')

  // toggle er jnnop useState , false dewa karon by default login hobe na 
  const [isLogin, setisLogin] = useState(false)

  // google signin handler 
  const handleGoogleSignin = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const { displayName, email } = result.user
        const loggedIn = {
          name: displayName,
          email: email
        }
        setUser(loggedIn)
      })
  }

  // register handler from form tag 
  const handleRegister = event => {
    event.preventDefault()
    console.log(email, pass)
    // pass required
    if (pass.length < 6) {
      setError('Password must be atleast 6 characters ')
      return
    }
    // register 

    isLogin ? processLogin(email, pass) : createNewUser(email, pass)
  }


  // login process 
  const processLogin = (email, pass) => {
    signInWithEmailAndPassword(auth, email, pass)
      .then(result => {
        const user = result.user
        console.log(user)
        setError('')
      })
      .catch(error => {
        setError(error.message)
      })
  }



  // new user 
  const createNewUser = (email, pass) => {
    createUserWithEmailAndPassword(auth, email, pass)
      .then(result => {
        const user = result.user
        console.log(user)
        setError('')
        // register korar por email verify
        verifyEmail()
        // name register por set korar jnno
        setUserName()
      })
      .catch(error => {
        setError(error.message)
      })
  }
  // name 
  const setUserName=()=>{
    updateProfile(auth.currentUser, {
      displayName:name ,
    }).then(result => {
      // Profile updated!
      // ...
    })
  }
  // email verify 
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result)
      })
  }


  // email handler
  const handleEmail = event => {
    setEmail(event.target.value)
  }
  //  pass handler
  const handlePass = event => {
    setPass(event.target.value)
  }
  // toggleLogin
  const toggleLogin = event => {
    setisLogin(event.target.checked)
  }
  // handle reset pass
  const handleResetPass = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => { })
  }
  // handle name
  const handleName=event=>{
    setName(event.target.value)

  }
  return (
    <div className="w-50 mx-auto mt-5">

      <form onSubmit={handleRegister}>
        {/* turnary operator use kore bola hoise login hoile login na hoile register  */}
        <h3 className="text-primary text-center ">Please {isLogin ? 'Login' : 'Register'}</h3>
        {/* name ta only register er somoy dekhani hobe tai login e hide kore dewa holo */}
        { !isLogin && <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input onBlur={handleName} type="name" className="form-control" placeholder="enter your name" required />
          </div>
        </div>}
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmail} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePass} type="password" className="form-control" id="inputPassword3" required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              {/* onchange diye check kora hoilo j account ache ki na  */}
              <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already registered ?
              </label>
            </div>
            <button onClick={handleResetPass} className="btn btn-sm btn-primary w-25 ">Forgot password ?</button>
          </div>


        </div>
        {/* eror dekhanur jnno */}
        <div className="row mb-3 text-danger">
          {error}
        </div>
        {/* same turnary operator  */}
        <button type="submit" className="btn btn-primary w-100">{isLogin ? 'Login' : 'Register'}</button>
      </form>




      <br /><br /><br /><br />
      <div>.....................</div>
      <div>
        <button onClick={handleGoogleSignin}>Google SignIn</button>
        {
          user.name && <div>
            <h2>Welcome : {user.name}</h2>
            <p>Email : {user.email}</p>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
