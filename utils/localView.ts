export const changeView = (view: string,) => { 
    if (view === "grid") {
      localStorage.setItem("tech_star_view", "list");
      return "list"
    } else {
      localStorage.setItem("tech_star_view", "grid");
      return "grid"
    }
  }