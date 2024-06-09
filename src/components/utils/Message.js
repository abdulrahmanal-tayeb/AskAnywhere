export default function Message({ children }) {
    return (
        <>
            <div className="background-cover"></div>
            <div className="message">
                {children}
            </div>
        </>
    )
} 