import "./App.css";
import React from "react";
import axios from "axios";

class App extends React.Component {
  state = {
    user: {
      rick: {
        id: "4",
        name: "Rick Kay",
        email: "berbakay@hotmail.com",
        photoUrl:
          "https://www.thetelegraphandargus.co.uk/resources/images/11574659?type=responsive-gallery-fullscreen",
        role: "Member",
        info: "Business guru",
        welcomeMessage: "Catch my stream tomorrow night!",
      },
    },
    skills: {},
    possessedSkills: {},
  };

  componentDidMount() {
    axios
      .get("https://firebasing-testing.firebaseio.com/skills.json")
      .then((res) => {
        this.setState({ skills: res.data });
      });
  }

  handleClick = (e) => {
    console.log(this.state.possessedSkills);
    this.setState((prevState) => {
      const newSkills = { ...prevState.possessedSkills };
      newSkills[e.target.name] = true;
      return {
        possessedSkills: newSkills,
      };
    });
  };

  handleSubmit = () => {
    axios
      .patch(
        `https://firebasing-testing.firebaseio.com/users_teaching_skills/${
          Object.keys(this.state.user)[0]
        }.json`,
        this.state.possessedSkills
      )
      .then((res) => {
        Object.keys(this.state.possessedSkills).forEach((skill) => {
          axios.patch(
            `https://firebasing-testing.firebaseio.com/teaching_skills/${skill}.json`,
            { [Object.keys(this.state.user)[0]]: true }
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="App">
        {Object.keys(this.state.skills).map((category, index) => {
          return (
            <div key={index}>
              <h1 key={category}>{category}</h1>
              {Object.keys(this.state.skills[category]).map((skill, index) => {
                return (
                  <label key={index} htmlFor={skill}>
                    {skill}
                    <input
                      name={skill}
                      onClick={this.handleClick}
                      type="checkbox"
                      key={skill}
                    ></input>
                  </label>
                );
              })}
            </div>
          );
        })}
        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}

export default App;

//GET request for list of available skills and categories
//POST requests to add a user to desired skills table and desired skill to users skills table (ditto for teaching skills)
//POST request to possessed skills
