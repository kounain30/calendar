import React from "react";
import { Button, Modal } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import ImageSlider from "./imageSlider";
import styles from "./main.scss";

const getFromLS = key => {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("values")) || {};
    } catch (e) {}
  }
  return ls[key];
};

const saveToLS = (key, value) => {
  if (global.localStorage) {
    global.localStorage.setItem(
      "values",
      JSON.stringify({
        [key]: value
      })
    );
  }
};
const eventsList = getFromLS("events") || [];

export default class DemoApp extends React.Component {
  calendarComponentRef = React.createRef();

  state = {
    show: false,
    clickedinfo: "",
    showedit: false,
    hh: "",
    editedimage: [],
    calendarWeekends: true,
    title: "",
    description: "",
    indexValue: 0,
    imageArray: [],
    calendarEvents: JSON.parse(JSON.stringify(eventsList)),
    editStatus: false,
    createddate: "",
    time: ""
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showedit !== prevState.showedit) {
      let data = this.state.calendarEvents;
      let filterData = data.filter(item => !item.delete);
      this.setState({
        calendarEvents: filterData
      });
    }
  }

  handleClose = () => {
    this.setState({
      show: false
    });
  };
  deleteFunction = () => {
    let n1, index;
    for (let i = 0; i < this.state.calendarEvents.length; i++) {
      if (
        this.state.calendarEvents[i]["id"] ===
        this.state.clickedinfo.event._def.publicId
      ) {
        n1 = this.state.calendarEvents[i];
        index = i;
      }
    }

    let n2 = [...this.state.calendarEvents];
    n2.splice(index, 1);
    this.setState({
      calendarEvents: n2,
      showedit: false
    });
  };

  editImagemage = e => {
    e.preventDefault();

    let file = e.target.files[0];
    let reader = new FileReader();

    if (e.target.files.length === 0) {
      return;
    }

    reader.onloadend = e => {
      this.setState({
        editedimage: [reader.result]
      });
    };

    reader.readAsDataURL(file);
  };

  getId = info => {
    this.setState({
      clickedinfo: info,
      showedit: true,
      indexValue: info.event.id
    });
  };
  handleCloseedit = () => {
    this.setState({
      showedit: false,
      editStatus: false
    });
  };
  toggleWeekends = () => {
    this.setState({
      calendarWeekends: !this.state.calendarWeekends
    });
  };

  gotoPast = () => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.gotoDate("2000-01-01");
  };

  handleFormUpdate = () => {
    let data = this.state.calendarEvents;
    let getIndex = data.findIndex(item => item.id === this.state.indexValue);
    data[getIndex].title = this.state.title;
    data[getIndex].description = this.state.description;
    data[getIndex].eventtime = this.state.time;
    data = [...data, { delete: true }];

    console.log("Edited".data);

    this.setState({
      calendarEvents: [...data],
      showedit: false,
      editStatus: false
    });
    saveToLS("events", [...data]);
  };

  handleFormSubmit = e => {
    let arg = this.state.hh;

    let data = this.state.calendarEvents.concat({
      id: arg.view.uid,
      title: this.state.title,
      description: this.state.description,
      images: this.state.imageArray,
      start: arg.date,
      clickedinfo: "",
      eventtime: this.state.time,
      createddate: new Date()
    });
    this.setState({
      show: false,
      calendarEvents: data
    });
    saveToLS("events", [...data]);
  };

  handleDateClick = arg => {
    if ("add event?" + arg.datestr + "?") {
      this.setState({
        show: true,
        hh: arg
      });
      console.log("dc", arg);
      //
    } else {
      alert("try again with correct format ");
    }
  };

  onChangeHandler = event => {
    let nam = event.target.name;
    let val = event.target.value;

    this.setState({
      [nam]: val
    });
  };
  onEditHandler = event => {
    let nam = event.target.name;
    let val = event.target.value;

    this.setState({
      [nam]: val
    });
  };
  handleImageUpload = e => {
    let image = [];
    let files = Array.from(e.target.files);
    image.push(files);
    this.setState({
      imageArray: image
    });
    console.log(this.state.imageArray);
  };

  editStatus = () => {
    this.setState({
      editStatus: !this.state.editStatus
    });
  };

  render() {
    console.log("UpdatedChanges", this.state.createddate);
    let data = this.state.calendarEvents;
    return (
      <div className="demo-app">
        <div className="demo-app-top">
          <button onClick={this.toggleWeekends}>toggle weekends</button>&nbsp;
          <button onClick={this.gotoPast}>go to a date in the past</button>
        </div>

        <div className="demo-app-calendar">
          <FullCalendar
            defaultView="dayGridMonth"
            header={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
            }}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            ref={this.calendarComponentRef}
            weekends={this.state.calendarWeekends}
            events={data}
            editable
            dateClick={e => this.handleDateClick(e)}
            eventResize={this.handleItemResize}
            eventClick={info => {
              this.getId(info);
            }}
          />
        </div>
        <>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <label style={styles.labelStyle}>
                  Enter Title:
                  <input
                    style={{ marginLeft: "10px" }}
                    type="text"
                    name="title"
                    placeholder="Title"
                    onChange={this.onChangeHandler}
                  />
                </label>
                <br />
                <label style={styles.labelStyle}>
                  Enter Description:
                  <input
                    style={{ marginLeft: "10px" }}
                    type="text"
                    name="description"
                    placeholder="description"
                    onChange={this.onChangeHandler}
                  />
                </label>
                <br />
                <label>Event Time</label>
                <input
                  type="time"
                  id="appt"
                  name="time"
                  min="00:00"
                  max="23:00"
                  placeholder={""}
                  onChange={this.onChangeHandler}
                />
                <br />
                <label style={styles.labelStyle}>
                  Select Image:
                  <input
                    style={{ marginLeft: "10px" }}
                    type="file"
                    onChange={this.handleImageUpload}
                    multiple
                  />
                </label>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.handleClose()}>
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={this.handleFormSubmit}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>

        <>
          <Modal show={this.state.showedit} onHide={this.handleCloseedit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {!this.state.editStatus ? (
                <ImageSlider
                  data={
                    this.state.clickedinfo.event &&
                    this.state.clickedinfo.event._def.extendedProps.images
                  }
                  extraData={this.state.clickedinfo.event}
                  editStatus={this.editStatus}
                />
              ) : (
                <form>
                  <div>
                    <label>
                      Edit Title:
                      <input
                        type="text"
                        style={{ marginLeft: "10px" }}
                        placeholder={
                          this.state.clickedinfo
                            ? this.state.clickedinfo.event._def.title
                            : ""
                        }
                        name="title"
                        onChange={this.onEditHandler}
                      />
                    </label>
                    <br />
                    <label>
                      Edit Description:
                      <input
                        type="text"
                        style={{ marginLeft: "10px" }}
                        name="description"
                        placeholder={
                          this.state.clickedinfo
                            ? this.state.clickedinfo.event._def.extendedProps
                                .description
                            : ""
                        }
                        onChange={this.onEditHandler}
                      />
                    </label>
                    <br />
                    <label>
                      Created Date:
                      <p>
                        {this.state.clickedinfo && this.state.clickedinfo.start}
                      </p>
                    </label>
                    <br />
                    <label>
                      Edit Event Time:
                      <input
                        type="time"
                        name="time"
                        min="00:00"
                        max="23:00"
                        defaultValue={
                          this.state.clickedinfo &&
                          this.state.clickedinfo.event._def.extendedProps
                            .eventtime
                        }
                        onChange={this.onEditHandler}
                      />
                    </label>
                    <br />
                    <label>Uploaded Images:</label>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        flexWrap: "nowrap"
                      }}
                    >
                      {this.state.clickedinfo.event &&
                        this.state.clickedinfo.event._def.extendedProps.images
                          .length > 0 &&
                        this.state.clickedinfo.event._def.extendedProps.images[0].map(
                          (item, index) => (
                            <img
                              key={index}
                              style={{
                                height: "100px",
                                width: "100px",
                                padding: "20px"
                              }}
                              src={
                                "https://homepages.cae.wisc.edu/~ece533/images/airplane.png"
                              }
                              alt="insert"
                            />
                          )
                        )}
                    </div>
                  </div>
                </form>
              )}
            </Modal.Body>
            {this.state.editStatus && (
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleCloseedit}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => this.handleFormUpdate()}
                >
                  Save Changes
                </Button>
                <Button variant="primary" onClick={this.deleteFunction}>
                  Delete
                </Button>
              </Modal.Footer>
            )}
          </Modal>
        </>
      </div>
    );
  }
}
