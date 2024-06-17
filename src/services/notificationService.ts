const notificationService = (token: string, title: string, body?: string, icon?: string) => {
    try {
      fetch(`${process.env.REACT_APP_SEND_MESSAGE_API_URL}?token=${token}&title=${title}&body=${body ? body : "none"}&icon=${"none"}`, {
        method: "POST",
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
}

export default notificationService