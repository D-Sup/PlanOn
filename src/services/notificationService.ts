const notificationService = (title: string, body: string, token: string) => {
    try {
      fetch(`${process.env.REACT_APP_SEND_MESSAGE_API_URL}?title=${title}&body=${body}&token=${token}`, {
        method: "POST",
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
}

export default notificationService