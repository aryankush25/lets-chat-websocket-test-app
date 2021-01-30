import React, { useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'

const users = [
	{
		name: 'Aryan GeekyAnts',
		id: 'e3aecaa2-42c0-47dc-a8e7-53554d844286',
		token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUzYWVjYWEyLTQyYzAtNDdkYy1hOGU3LTUzNTU0ZDg0NDI4NiIsImVtYWlsIjoiYXJ5YW5AZ2Vla3lhbnRzLmNvbSIsImV4cCI6MTYxNzE4NjE5MSwiaWF0IjoxNjEyMDAyMTkxfQ.i8sfIGYuBLSlhxvySUI_xFOZOdYuvjNUEIBVq8aaCNI'
	},
	{
		name: 'Nayan J Das',
		id: 'cc072a77-f3e6-4d88-9069-39982d48e64f',
		token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNjMDcyYTc3LWYzZTYtNGQ4OC05MDY5LTM5OTgyZDQ4ZTY0ZiIsImVtYWlsIjoibmF5YW5qQGdlZWt5YW50cy5jb20iLCJleHAiOjE2MTcxODYyNDAsImlhdCI6MTYxMjAwMjI0MH0.Sx95HiyqTfawVLH59D6TzPWdLNnEj2zcZhJft-AbV9Y'
	},
	{
		name: 'Aryan Agarwal',
		id: '46f50d9d-eeb2-4614-a3d6-9a63a42b14a0',
		token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ2ZjUwZDlkLWVlYjItNDYxNC1hM2Q2LTlhNjNhNDJiMTRhMCIsImVtYWlsIjoiYXJ5YW5rdXNoMDI1QGdtYWlsLmNvbSIsImV4cCI6MTYxNzE4NjI4NywiaWF0IjoxNjEyMDAyMjg3fQ.0Kr3KdlhQKQURdu5PNYHqmTjbS_BIEo5zq2Ul7_CnLg'
	}
]

function App({ from, to }) {
	const [text, setText] = useState('')
	const socketRef = React.useRef(null)
	const userOnlineSocketRef = React.useRef(null)

	React.useEffect(() => {
		socketRef.current = io('http://localhost:7000', {
			transports: ['websocket'],
			auth: {
				token: users.find((user) => from === user.id).token
			}
		})

		socketRef.current.on('message', (update: any) => {
			console.log('message update', update)
		})
	}, [from])

	React.useEffect(() => {
		userOnlineSocketRef.current = io('http://localhost:7000', {
			path: '/userOnline',
			transports: ['websocket'],
			auth: {
				token: users.find((user) => from === user.id).token
			},
			query: {
				userToSubscribe: to
			}
		})

		userOnlineSocketRef.current.on('message', (update: any) => {
			console.log('userOnline message update', update)
		})
	}, [from, to])

	const handleSendMessage = () => {
		socketRef.current.emit('message', { text, to }, (response: any) => {
			console.log('#### response', response)

			const { isSuccess } = response

			if (!isSuccess) {
				alert(response.error)
			}
		})
	}

	return (
		<div className='App'>
			<h1>From: {users.find((user) => user.id === from).name}</h1>
			<h1>To: {users.find((user) => user.id === to).name}</h1>

			<input value={text} onChange={(e) => setText(e.target.value)} />
			<button onClick={handleSendMessage}>Send</button>
		</div>
	)
}

const MainApp = () => {
	const [userIds, setUserIds] = useState<any>({
		from: '',
		to: ''
	})

	if (userIds.to && userIds.from) {
		return <App from={userIds.from} to={userIds.to} />
	}

	return (
		<div className='App'>
			<h1>
				From User Id:{' '}
				<select
					value={userIds.from}
					onChange={(e) => {
						setUserIds({
							...userIds,
							from: e.target.value
						})
					}}
				>
					<option value=''>None</option>
					{users
						.filter((user) => {
							return user.id !== userIds.to
						})
						.map((user) => {
							return (
								<option key={user.id} value={user.id}>
									{user.name}
								</option>
							)
						})}
				</select>
			</h1>

			<h1>
				To User Id:{' '}
				<select
					value={userIds.to}
					onChange={(e) => {
						setUserIds({ ...userIds, to: e.target.value })
					}}
				>
					<option value=''>None</option>
					{users
						.filter((user) => {
							return user.id !== userIds.from
						})
						.map((user) => {
							return (
								<option key={user.id} value={user.id}>
									{user.name}
								</option>
							)
						})}
				</select>
			</h1>
		</div>
	)
}

export default MainApp
