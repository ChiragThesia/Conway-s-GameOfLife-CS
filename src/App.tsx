import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';

const numRows = 30;
const numCols = 30;

const operations = [ [ 0, 1 ], [ 0, -1 ], [ 1, -1 ], [ -1, 1 ], [ 1, 1 ], [ -1, -1 ], [ 1, 0 ], [ -1, 0 ] ];

const emptyGrid = () => {
	const rows = [];
	for (let i = 0; i < numRows; i++) {
		rows.push(Array.from(Array(numCols), () => 0));
	}
	return rows;
};
function App() {
	const [ grid, setGrid ] = useState(() => {
		return emptyGrid();
	});

	const [ running, setRunning ] = useState(false);

	const runningRef = useRef(running);
	runningRef.current = running;

	const runSim = useCallback(() => {
		if (!runningRef.current) {
			return;
		}

		setGrid((g) => {
			return produce(g, (gridCopy) => {
				for (let i = 0; i < numRows; i++) {
					for (let k = 0; k < numCols; k++) {
						let neighbors = 0;
						operations.forEach(([ x, y ]) => {
							const newI = i + x;
							const newK = k + y;
							if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
								neighbors += g[newI][newK];
							}
						});

						if (neighbors < 2 || neighbors > 3) {
							gridCopy[i][k] = 0;
						}
						else if (g[i][k] === 0 && neighbors === 3) {
							gridCopy[i][k] = 1;
						}
					}
				}
			});
		});

		setTimeout(runSim, 100);
	}, []);

	return (
		<div style={{ paddingLeft: 50, paddingTop: 50 }}>
			<h1
				style={{
					color: '#685206',
					fontFamily: 'Helvetica Neue',
					fontSize: 30,
					fontWeight: 'bold',
					letterSpacing: 1,
					lineHeight: 1
				}}
			>
				Conway's Game of Life
			</h1>
			<ul
				style={{
					listStyleType: 'circle',
					listStylePosition: 'inside',
					listStyleImage: 'inherit'
				}}
			>
				<li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
				<li>Any live cell with two or three live neighbours lives on to the next generation.</li>
				<li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
				<li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
			</ul>
			<div>
				<button
					style={{
						backgroundColor: '#4CAF50',
						border: 'solid 2px black',
						color: 'white',
						textAlign: 'center',
						textDecoration: 'none',
						fontSize: 20,
						fontWeight: 'bold',
						paddingTop: 1,
						paddingBottom: 1
					}}
					onClick={() => {
						setRunning(!running);
						if (!running) {
							runningRef.current = true;
							runSim();
						}
					}}
				>
					{running ? 'stop' : 'start'}
				</button>
				<button
					style={{
						backgroundColor: '#4CAF50',
						border: 'solid 2px black',
						color: 'white',
						textAlign: 'center',
						textDecoration: 'none',
						fontSize: 20,
						fontWeight: 'bold',
						paddingTop: 1,
						paddingBottom: 1
					}}
					onClick={() => {
						setGrid(emptyGrid());
					}}
				>
					clear
				</button>
				<button
					style={{
						backgroundColor: '#4CAF50',
						border: 'solid 2px black',
						color: 'white',
						textAlign: 'center',
						textDecoration: 'none',
						fontSize: 20,
						fontWeight: 'bold',
						paddingTop: 1,
						paddingBottom: 1
					}}
					onClick={() => {
						const rows = [];
						for (let i = 0; i < numRows; i++) {
							rows.push(Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0)));
						}
						setGrid(rows);
					}}
				>
					random
				</button>
			</div>
			<div style={{ display: 'grid', gridTemplateColumns: `repeat(${numCols}, 20px)`, justifySelf: 'center' }}>
				{grid.map((rows, i) =>
					rows.map((col, k) => (
						<div
							key={`${i}-${k}`}
							onClick={() => {
								const newGrid = produce(grid, (gridCopy) => {
									gridCopy[i][k] = grid[i][k] ? 0 : 1;
								});
								setGrid(newGrid);
							}}
							style={{
								width: 20,
								height: 20,
								backgroundColor: grid[i][k] ? 'red' : undefined,
								border: 'solid 1px black'
							}}
						/>
					))
				)}
			</div>
		</div>
	);
}

export default App;
