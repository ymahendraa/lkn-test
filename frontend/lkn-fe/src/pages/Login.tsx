import LoginForm from "../components/LoginForm"

const Login: React.FC = () => {
    return (
        <div
            className="flex flex-col gap-2 items-center justify-center h-screen"
        >
            <h1 className="text-2xl font-bold text-center">Welcome to <br /> LKN Task Scheduler App</h1>
            <h2
                className="text-lg font-semibold text-center"
            >
                Please login to continue
            </h2>
            <div
                className="w-96"
            >
                <LoginForm />
            </div>
        </div>
    )
}

export default Login;