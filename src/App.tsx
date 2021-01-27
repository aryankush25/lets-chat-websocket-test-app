import React, { useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'

const users = [
	{
		name: 'Aryan Agarwal',
		id: '7b54826b-67e1-4477-bedb-d6f271364007'
	},
	{
		name: 'Aryan Kush',
		id: 'f674fa6d-8dcb-43f4-bfbc-d744956d5c63'
	},
	{
		name: 'Nayan J Das',
		id: '563ad164-9c2f-49f7-856e-0ac116bb44c2'
	}
]

function App({ from, to }) {
	const [text, setText] = useState('')
	const socketRef = React.useRef(null)

	React.useEffect(() => {
		socketRef.current = io('http://localhost:7000', {
			transports: ['websocket'],
			auth: {
				token: '123'
			},
			query: {
				'my-key': 'my-value'
			}
		})

		socketRef.current.emit('userOnline', { userId: from }, (error: any) => {
			if (error) {
				alert(error)
			}
		})

		socketRef.current.on('message', (props: any) => {
			console.log(props)
		})
	}, [from])

	const handleSendMessage = () => {
		socketRef.current.emit('message', { text, to })
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

	console.log('#### userIds', userIds)

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
