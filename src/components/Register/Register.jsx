import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../contexts/ContextProvider";

function Register() {
  const register = useRef();
  const login = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passRef = useRef();
  const rule = useRef();
  const nxt = useRef();

  const submitBtn = useRef();
  const errorRef = useRef();
  const cpassRef = useRef();

  const { setLoginStatus } = useContext(DataContext);
  const [input, setInput] = useState({
    name: "",
    email: "",
    phone: "",
    pass: "",
    posts: [],
    profileImage: "",
    darkMode: false,
  });
  const [loginData, setLoginData] = useState({
    email: "",
    pass: "",
  });
  const [crntTab, setTab] = useState(1);
  const [err, setErr] = useState("");
  const [validate, setValidate] = useState({
    name: false,
    mail: false,
    phone: false,
    pass: false,
    cpass: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    submitBtn.current.disabled = !Object.values(validate).every((e) => e);
  }, [validate]);

  //regression
  const nameReg = /(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/;
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passReg =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{6,15}$/;
  const phoneReg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

  async function signUp(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/users/add/user", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          input,
        }),
      });
      if (res.ok) {
        alert(res.json().message);
        changeForm(2);
        register.current.reset();
      }
    } catch (e) {
      console.log(e);
    }
  }
  async function Login(e) {
    e.preventDefault();
    const res = await fetch(`http://localhost:8000/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginData.email,
        pass: loginData.pass,
      }),
    });
    if (res.status == 200) {
      const resData = await res.json();
      sessionStorage.setItem("authenticated", "true");
      sessionStorage.setItem("user", JSON.stringify(resData));
      navigate("/home", { replace: true });
    } else {
      setErr("Invalid Crendential");
      errorRef.current.style.display = "block";
    }
  }

  function changeTab(tab) {
    setTab(tab);
  }

  //form change
  function changeForm(id) {
    if (id === 1) {
      login.current.style.display = "none";
      register.current.style.display = "block";
    } else {
      register.current.style.display = "none";
      login.current.style.display = "block";
    }
  }

  //validation

  function handleChange(e) {
    if (e.target.name == "lmail") {
      if (!emailReg.test(e.target.value)) {
        setErr("Enter the valid mail");
        emailRef.current.style.borderColor = "red";
        errorRef.current.style.display = "block";
      } else {
        setLoginData((input) => ({ ...input, email: e.target.value }));
        emailRef.current.style.borderColor = "black";
        errorRef.current.style.display = "none";
      }
    }
    if (e.target.name == "lpass") {
      setLoginData((input) => ({ ...input, pass: e.target.value }));
    }
    //registraion
    if (e.target.name == "name") {
      if (!nameReg.test(e.target.value)) {
        setErr("Enter the valid name");
        setValidate((validate) => ({ ...validate, [e.target.name]: false }));
        nameRef.current.style.borderColor = "red";
        errorRef.current.style.display = "block";
      } else {
        setInput((input) => ({ ...input, [e.target.name]: e.target.value }));
        setValidate((validate) => ({ ...validate, [e.target.name]: true }));
        nameRef.current.style.borderColor = "black";
        errorRef.current.style.display = "none";
      }
    }
    if (e.target.name == "mail") {
      if (!emailReg.test(e.target.value)) {
        setErr("Enter the valid mail");
        setValidate((validate) => ({ ...validate, [e.target.name]: false }));
        emailRef.current.style.borderColor = "red";
        errorRef.current.style.display = "block";
      } else {
        setInput((input) => ({ ...input, [e.target.name]: e.target.value }));
        setValidate((validate) => ({ ...validate, [e.target.name]: true }));
        emailRef.current.style.borderColor = "black";
        errorRef.current.style.display = "none";
      }
    }
    if (e.target.name == "phone") {
      if (!phoneReg.test(e.target.value)) {
        setErr("Enter the valid phone");
        setValidate((validate) => ({ ...validate, [e.target.name]: false }));
        phoneRef.current.style.borderColor = "red";
        errorRef.current.style.display = "block";
      } else {
        setInput((input) => ({ ...input, [e.target.name]: e.target.value }));
        setValidate((validate) => ({ ...validate, [e.target.name]: true }));
        phoneRef.current.style.borderColor = "black";
        errorRef.current.style.display = "none";
      }
    }
    if (e.target.name == "pass") {
      if (!passReg.test(e.target.value)) {
        setErr("Enter the valid password");
        setValidate((validate) => ({ ...validate, [e.target.name]: false }));
        passRef.current.style.borderColor = "red";
        errorRef.current.style.display = "block";
        rule.current.style.display = "block";
      } else {
        setInput((input) => ({ ...input, [e.target.name]: e.target.value }));
        setValidate((validate) => ({ ...validate, [e.target.name]: true }));
        passRef.current.style.borderColor = "black";
        errorRef.current.style.display = "none";
        rule.current.style.display = "none";
      }
    }
    if (e.target.name == "cpass") {
      if (input.pass != e.target.value) {
        setErr("Password not match");
        setValidate((validate) => ({ ...validate, [e.target.name]: false }));
        cpassRef.current.style.borderColor = "red";
        errorRef.current.style.display = "block";
      } else {
        setValidate((validate) => ({ ...validate, [e.target.name]: true }));
        cpassRef.current.style.borderColor = "black";

        errorRef.current.style.display = "none";
      }
    }
  }

  return (
    <div className="regs">
      <div className="brand">ConnectV</div>
      <div className="form-container">
        <div className="image">
          <img
            src="https://static.vecteezy.com/system/resources/previews/002/923/747/large_2x/global-network-connection-world-map-point-and-line-composition-concept-of-global-business-illustration-free-vector.jpg"
            alt="register"
            width="100%"
            height="100%"
          />
        </div>
        <form action="" className="register" ref={register} onSubmit={signUp}>
          <div className="tab-container">
            <div ref={errorRef} className="error">
              {err}
            </div>
            <div className={crntTab === 1 ? "content active" : "content"}>
              <div className="inputfield">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                  ref={nameRef}
                />
              </div>
              <div className="inputfield">
                <label htmlFor="name">Email</label>
                <input
                  type="email"
                  name="mail"
                  id=""
                  required
                  onChange={handleChange}
                  ref={emailRef}
                />
              </div>
              <div className="inputfield">
                <label htmlFor="name">Mobile</label>
                <input
                  type="tel"
                  name="phone"
                  id=""
                  required
                  onChange={handleChange}
                  ref={phoneRef}
                />
              </div>
              <div className="inputfield">
                <button
                  className="reg-button"
                  onClick={() => {
                    changeTab(2);
                  }}
                  ref={nxt}
                >
                  Next
                </button>
              </div>
              <div className="inputfield pc">
                <div className="center">Already have an account</div>
                <span
                  className="nav-text center"
                  onClick={() => {
                    changeForm(2);
                  }}
                >
                  Login
                </span>
              </div>
            </div>
            <div className={crntTab === 2 ? "content active" : "content"}>
              <div className="inputfield">
                <label htmlFor="name">Password</label>
                <input
                  type="password"
                  name="pass"
                  required
                  ref={passRef}
                  onChange={handleChange}
                />
              </div>
              <div className="inputfield">
                <label htmlFor="name">Confirm</label>
                <input
                  type="password"
                  name="cpass"
                  id=""
                  required
                  ref={cpassRef}
                  onChange={handleChange}
                />
                <div ref={rule} id="rule">
                  Password must contain <br />
                  1 uppercase, <br />
                  1 lowercase, <br />
                  1 number, <br />1 special symbol (@,#,$,*)
                </div>
              </div>
              <div className="inputfield">
                <div className="center">Don't have an account ? </div>
                <span
                  className="nav-text center"
                  onClick={() => {
                    changeForm(2);
                  }}
                >
                  Log-In
                </span>
              </div>
              <div className="inputfield ">
                <div className="buttons">
                  <button
                    className="reg-button"
                    onClick={() => {
                      changeTab(1);
                    }}
                  >
                    Prev
                  </button>
                  <input type="submit" value="SignIn" ref={submitBtn} />
                </div>
              </div>
            </div>
          </div>
        </form>
        <form action="" className="login" ref={login} onSubmit={Login}>
          <div className="tab-container">
            <div ref={errorRef} className="error">
              {err}
            </div>
            <div className="inputfield">
              <label htmlFor="name">Email</label>
              <input
                type="email"
                name="lmail"
                id=""
                required
                ref={emailRef}
                onChange={handleChange}
              />
            </div>
            <div className="inputfield">
              <label htmlFor="name">Password</label>
              <input
                type="password"
                name="lpass"
                required
                ref={passRef}
                onChange={handleChange}
              />
            </div>
            <div className="inputfield">
              <input type="submit" value="Login" />
            </div>
            <div className="inputfield">
              <div className="center">Don't have an account ? </div>
              <span
                className="nav-text center"
                onClick={() => {
                  changeForm(1);
                }}
              >
                Sign-Up
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
