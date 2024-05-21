const notificationService = (token: string, action: string, title: string, body?: string, icon?: string) => {
    try {
      // const encodedIcon = icon ? encodeURIComponent(icon) : "none";
      fetch(`${process.env.REACT_APP_SEND_MESSAGE_API_URL}?token=${token}&action=${action}&title=${title}&body=${body ? body : "none"}&icon=${"none"}`, {
        method: "POST",
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
}

export default notificationService