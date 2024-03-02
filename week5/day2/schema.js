const express = require("express");
const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/mydb")
  .then(() => console.log("Connected to database"))
  .catch((error) => console.log("Error: ", error));

const courseSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
},{
  Timestamps:true
  } );
//Model
//Class
const Course = mongoose.model("Course", courseSchema);
// Take Objet
const course = new Course({
  name: "Mike Ross",
  email: "mike.ross@arkx.group",
  age: 30,
});

course
  .save()
  .then((course) => console.log("User created succesfully: ", course))
  .catch((error) => console.log("Error creating user: ", error));

//CRUD : CREATE - READ - UPDATE - DELETE

async function getCourses() {
  try {
    const courses = await Course.find({});
    console.log(courses);
  } catch (error) {
    console.log("Error fetching users: ", error.message);
  }
}

async function findCourse() {
  try {
    const result = await Course.findOne({ name: "Mike Ross", email: "mike.ross@arkx.group" });
    if (result) {
      console.log(result);
    } else {
      console.log("Course not found.");
    }
  } catch (error) {
    console.error("Error finding course:", error.message);
  }
}

findCourse(); 


async function updateCourse(name, newEmail){
  try {
    const course = await Course.findOneAndUpdate({ name });

    if (!course) {
      console.log('User not found.');
      return;
    }
    course.email = newEmail;
    await course.save();
    console.log('Updated user:', course);
  } catch (error) {
    console.error('Error updating email:', error.message);
  }
}
updateCourse('Mike Ross', 'ikram@1254');


async function deleteCourse(target) {
  try {
    // console.log('Deleting users before:', target);
    const result = await Course.deleteMany({ createdAt: { $lt: target } });
    console.log(`${result.deletedCount} user(s) deleted.`);
  } catch (error) {
    console.error('Error deleting users:', error.message);
  }
}

const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
deleteCourse(oneWeekAgo);



// equal = eq
// not equal = ne
// greater than = gt
// less than = lt
// in (20,25,50) = in
// not in = nin