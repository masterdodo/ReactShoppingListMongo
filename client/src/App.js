import React, { Component } from 'react'
import axios from 'axios'

class App extends Component {
  state = {
    data: [],
    id: 0,
    name: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objIdToDelete: null,
    objIdToUpdate: null,
  }

  componentWillMount()
  {
    this.getDataFromDb()
    if(!this.state.intervalIsSet)
    {
      let interval = setInterval(this.getDataFromDb, 1000)
      this.setState({ intervalIsSet: interval })
    }
  }

  componentWillUnmount()
  {
    if(this.state.intervalIsSet)
    {
      clearInterval(this.state.intervalIsSet)
      this.setState({ intervalIsSet: null })
    }
  }

  getDataFromDb = () => {
    fetch("api/getData")
    .then(data => data.json())
    .then(res => this.setState({ data: res.data }))
  }

  putDataToDb = name => {
    let currentIds = this.state.data.map(data => data.id)
    let idToBeAdded = 0
    while(currentIds.includes(idToBeAdded))
    {
      ++idToBeAdded
    }

    axios.post("api/putData", {
      id: idToBeAdded,
      name: name
    })
  }

  updateDB(idToUpdate, updateToApply)
  {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  deleteFromDbStart(itemId)
  {
    this.setState({ idToDelete: itemId })
    var deleteid = itemId
    this.deleteFromDb(deleteid)
  }

  deleteFromDb(idToDelete)
  {
    var objIdToDelete = null
    this.state.data.forEach(dat => {
      if(dat.id === idToDelete)
      {
        objIdToDelete = dat._id
        this.setState({ objIdToDelete: objIdToDelete })
      }
    })

    axios.delete("/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  }

  render() {
    const { data } = this.state;
    return (
      <div id="reactContainer">
        <div className="container top">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="text-center">Shopping list</h2>
            </div>
          </div>
        </div>
        <div className="container wb">
          <div className="row">
          <div className="col-lg-12 input-group">
              <input
                className="center-block"
                type="text"
                onChange={e => this.setState({ name: e.target.value })}
                placeholder="Insert item..."
              />
              <button 
                className="btn btn-success center-block" 
                onClick={() => this.putDataToDb(this.state.name)}>
                Create
              </button>
            </div>
                <table>
                <tbody>
                {data.length <= 0
                  ? <tr><td colSpan="3">Nothing!</td></tr>
                  : data.map(dat => (
                        <tr key={dat.id}>
                        <td>
                        • {dat.name}&nbsp;
                        </td>
                        <td>
                        <button 
                        className="btn btn-danger center-block" 
                        onClick={() => this.deleteFromDbStart(dat.id)}>
                        Remove</button>
                        </td>
                        </tr>
                    ))}
                </tbody>
                </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App
