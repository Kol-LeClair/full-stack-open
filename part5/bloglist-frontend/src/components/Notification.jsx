const Notification = ({ message, isError }) => {
    const notificationStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }
    
    if (message === null) {
        return null
    }

    if (isError === true) {
        return (
            <div className="error">
                {message}
            </div>
        )
    }

    return (
        <div style={notificationStyle}>
            {message}
        </div>
    )
}

export default Notification