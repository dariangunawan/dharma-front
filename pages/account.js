import Button from "@/components/Button"
import Center from "@/components/Center"
import FacebookLoginButton from "@/components/FacebookLoginButton"
import GoogleLoginButton from "@/components/GoogleLoginButton"
import Header from "@/components/Header"
import { auth } from "@/lib/firebase"
import axios from "axios"
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

// fitur ini belum berfungsi

export default function AccountPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({
    name: null,
    phone: null,
    email: null,
    password: null,
  })

  const handleChange = (value, field) => {
    setForm((prevState) => ({ ...prevState, [field]: value }))
  }

  const handleCreateUserWithEmailAndPassword = async ({ email, password }) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user

      axios
        .post("/api/auth", {
          userId: user.uid,
          ...form,
        })
        .then((res) => {
          toast.success("Selamat, Register telah berhasil")
          return router.replace("/")
        })
    } catch (error) {
      console.log(error.code, form, "error.code")
      if (
        error.code ===
        "auth/invalid-value-(email),-starting-an-object-on-a-scalar-field-invalid-value-(password),-starting-an-object-on-a-scalar-field"
      ) {
        // Handle invalid email error
        return toast.error("Email Tidak Valid")
        // Display user-friendly error message
      } else if (error.code === "auth/invalid-credential") {
        // Handle invalid email error
        return toast.error("Email atau Kata Sandi Tidak Sesuai")
        // Display user-friendly error message
      } else if (error.code === "auth/email-already-in-use") {
        // Handle invalid email error
        return toast.error("Email Sudah Terdaftar")
        // Display user-friendly error message
      } else {
        // Handle other FirebaseAuth errors
      }
    }
  }

  const handleSignInWithEmailAndPassword = async ({ email, password }) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      toast.success("Selamat, Login telah berhasil")
      return router.replace("/")
    } catch (error) {
      console.log(error.code, form, "error.code")
      if (
        error.code ===
        "auth/invalid-value-(email),-starting-an-object-on-a-scalar-field-invalid-value-(password),-starting-an-object-on-a-scalar-field"
      ) {
        // Handle invalid email error
        return toast.error("Email Tidak Valid")
        // Display user-friendly error message
      } else if (error.code === "auth/invalid-credential") {
        // Handle invalid email error
        return toast.error("Email atau Kata Sandi Tidak Sesuai")
        // Display user-friendly error message
      } else {
        // Handle other FirebaseAuth errors
      }
    }
  }

  const handleLogOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log("User signed out successfully")
        // Redirect to login page or display logout message
      })
      .catch((error) => {
        console.error("Error signing out:", error)
      })
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        axios
          .get("/api/auth?userId=" + user.uid)
          .then((res) => setIsLoggedIn(res.data))
        // User is signed in
        // Redirect to protected routes or display logged-in content
      } else {
        setIsLoggedIn(null)
        // User is not signed in
        console.log("User is not signed in")
        // Redirect to login or registration page
      }
    })
  }, [])

  const handleForgotPassword = async ({ email }) => {
    try {
      const result = await sendPasswordResetEmail(auth, email)
      toast.success("Link Lupa Kata sandi telah dikirim ke email")
      setIsForgotPassword(false)
      setIsLogin(true)
    } catch (error) {
      console.log(error.code, form, "error.code")
      return toast.error("Email atau Kata Sandi Tidak Sesuai")
    }
  }

  return (
    <>
      <Header />
      {isLoggedIn ? (
        <Center>
          <div className="mt-4">
            <h1>Selamat Datang {isLoggedIn?.name}</h1>

            <Button primary onClick={() => handleLogOut()}>
              Keluar
            </Button>
          </div>
        </Center>
      ) : (
        <Center>
          <div className="max-w-sm mx-auto mt-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-10 w-auto"
                src="https://i.imgur.com/nYikGVf.png"
                alt="dharma kreasi"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                {isForgotPassword ? "Lupa Kata Sandi" : " Silahkan Masuk"}
              </h2>
            </div>

            {isForgotPassword ? (
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" method="POST">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        onChange={(e) => handleChange(e.target.value, "email")}
                        required
                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={(e) => {
                        if (!form.email) {
                          return toast.error(
                            "Mohon lengkapi form terlebih dahulu"
                          )
                        }

                        return handleForgotPassword(form)
                      }}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Kirim Link Lupa Kata Sandi
                    </button>
                  </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                  Ingat Kata Sandi?
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsForgotPassword(false)
                      setIsLogin(true)
                    }}
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 pl-2"
                  >
                    Masuk Sekarang
                  </a>
                </p>
              </div>
            ) : (
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" method="POST">
                  {!isLogin && (
                    <>
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Nama Lengkap
                        </label>
                        <div className="mt-2">
                          <input
                            id="name"
                            name="name"
                            autoComplete="name"
                            onChange={(e) =>
                              handleChange(e.target.value, "name")
                            }
                            required
                            className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Nomor Hp
                        </label>
                        <div className="mt-2">
                          <input
                            id="phone"
                            name="phone"
                            autoComplete="phone"
                            onChange={(e) =>
                              handleChange(e.target.value, "phone")
                            }
                            required
                            className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        onChange={(e) => handleChange(e.target.value, "email")}
                        required
                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Kata Sandi
                      </label>
                      <div className="text-sm">
                        <a
                          href="#"
                          onClick={(event) => {
                            event.preventDefault()
                            setIsForgotPassword(true)
                          }}
                          className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Lupa Kata Sandi?
                        </a>
                      </div>
                    </div>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={(e) =>
                          handleChange(e.target.value, "password")
                        }
                        autoComplete="current-password"
                        required
                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={(e) => {
                        if (!form.email || !form.password) {
                          return toast.error(
                            "Mohon lengkapi form terlebih dahulu"
                          )
                        }

                        if (isLogin) {
                          return handleSignInWithEmailAndPassword(form)
                        }
                        return handleCreateUserWithEmailAndPassword(form)
                      }}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Masuk
                    </button>
                  </div>
                </form>
                <p className="font-semibold leading-2 text-center mt-6">ATAU</p>
                <div class="flex justify-around items-center mt-6">
                  <GoogleLoginButton />
                  <FacebookLoginButton />
                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                  {isLogin ? "Belum Punya Akun?" : "Sudah Punya Akun?"}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsLogin(!isLogin)
                    }}
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 pl-2"
                  >
                    {isLogin ? " Daftar Sekarang" : "Masuk Sekarang"}
                  </a>
                </p>
              </div>
            )}
          </div>
          {/* <Title>Account</Title>
        {session && (
          <Button primary onClick={logout}>
            Logout
          </Button>
        )}
        {!session && <GoogleLoginButton />} */}
        </Center>
      )}
    </>
  )
}
