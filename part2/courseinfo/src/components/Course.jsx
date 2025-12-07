const Header = (props) => {
  return <h1>{props.course.name}</h1>
}

const Part = (props) => {
  return <p>{props.part} {props.exercises}</p>
}

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map(part => <Part key={part.id} part={part.name} exercises={part.exercises} />)}
    </div>
  )
}

const Total = ({ course }) => {
  return <p>Number of exercises {course.parts.reduce((sum, part) => sum + part.exercises, 0)}</p>
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default Course