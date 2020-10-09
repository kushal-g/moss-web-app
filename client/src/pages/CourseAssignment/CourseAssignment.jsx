import React, { useContext, useEffect, useState } from 'react';
import useLocalStorage from '../../Hooks/useLocalStorage';
import { useParams } from 'react-router-dom';
import './CourseAssignment.css';
import { AuthContext } from '../../context/Auth';
import CourseAssignmentCard from './components/CourseAssignmentCard';
import Navbar from '../../components/Navbar/Navbar';

var randomColor = require('randomcolor');
export default function CourseAssignment(props) {
	const { currentUser, loading } = useContext(AuthContext);
	const [courseAssignment, setCourseAssignment] = useState([]);
	const [course, setCourse] = useState(false);
	let { id } = useParams();

	const [cardColor, setCardColor] = useLocalStorage(
		id,
		randomColor({
			luminosity: 'dark',
			format: 'rgba',
			alpha: 0.75,
		})
	);

	async function getSingleCourse() {
		const token = await currentUser.getIdToken();
		const result = await fetch(
			`${process.env.REACT_APP_URL}/classroom/course/read/?courseId=${id}`,
			{
				method: 'get',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-type': 'application/json',
				},
			}
		);

		const body = await result.json();
		console.log(body);
		setCourse(body.data.course);
		//console.log(body.data);
	}

	async function getAssignment() {
		const token = await currentUser.getIdToken();
		const result = await fetch(
			`${process.env.REACT_APP_URL}/classroom/courses/courseWork?courseId=${id}`,
			{
				method: 'get',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-type': 'application/json',
				},
			}
		);

		const body = await result.json();
		setCourseAssignment(body.data.courseWork);
		console.log(body.data.courseWork);
	}

	useEffect(() => {
		getAssignment();
		if (props.location.state) setCourse(props.location.state.course);
		else getSingleCourse();
	}, [currentUser]);

	return (
		<div>
			<Navbar />
			{course && (
				<div className="assignmentBox">
					<div className="courseDesc" style={{ backgroundColor: cardColor }}>
						<div className="assignmentCourseDetails">
							<div className="assignmentCourseName">{course.name}</div>
							<div className="assignmentCourseSection">
								{course.section ? course.section : ' '}
							</div>
							<div className="courseTeacher">{course.teacherInfo.name.fullName}</div>
						</div>
					</div>
					<div className="assignmentCard">
						{courseAssignment.map(assign => {
							return <CourseAssignmentCard assignment={assign} />;
						})}
					</div>
				</div>
			)}
		</div>
	);
}
