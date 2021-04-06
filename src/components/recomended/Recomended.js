import { useState, useEffect } from 'react';
import { Wrapper } from './recomended.styled';
import { useHistory } from 'react-router-dom';

const Recomended = ({ routs }) => {
	const [formInfo, setFormInfo] = useState({});
	let history = useHistory();
	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				console.log(position);
			},
			(error) => {
				console.error('Error Code = ' + error.code + ' - ' + error.message);
			}
		);
	}, []);
	const renderRegions = () => {
		let regionsArr = routs
			.filter((route) => route.Region.search(/[^a-z|A-Z| ]/) === -1)
			.map((route) => ({ region: route.Region, id: route._id }));
		regionsArr = regionsArr.filter(
			(regionItem, index, arr) =>
				index === arr.findIndex((r) => r.region === regionItem.region)
		);

		return regionsArr.map((regionItem) => (
			<option key={regionItem.id} value={regionItem.region}>
				{regionItem.region}
			</option>
		));
	};

	const handleInputChange = (event) => {
		setFormInfo({ ...formInfo, [event.target.name]: event.target.value });
	};

	const handleSearch = (event) => {
		event.preventDefault();
		console.log(formInfo);
		let flag = true;

		const result = routs.filter((route) => {
			flag = true;
			for (let key in formInfo) {
				if (key === 'Trail_Duration') {
					if (!route[key].includes(formInfo[key])) {
						flag = false;
					}
				}
				if (
					key === 'Parking' ||
					key === 'Suitable_for_Children' ||
					key === 'Suitable_for_Picnics'
				) {
					if (
						(formInfo[key] && route[key] !== 'Yes') ||
						(!formInfo[key] && route[key] !== 'No')
					) {
						console.log(formInfo[key], route[key]);
						flag = false;
					}
				} else if (route[key] !== formInfo[key]) {
					flag = false;
				}
			}
			if (flag) {
				return route;
			}
		});
		console.log(result);
		if (result.length) {
			history.push(
				`/categories/${result[0].Trail_Type}/routs/${result[0].Name.replaceAll(
					' ',
					''
				)}`
			);
		}

		event.target.reset();
	};
	return (
		<Wrapper>
			<form onSubmit={handleSearch}>
				<label className="title">
					Insert Duration of Your trip:{' '}
					<input
						type="number"
						name="Trail_Duration"
						onChange={handleInputChange}
					/>
				</label>
				<label className="title">
					Choose Region:{' '}
					<select name="Region" onChange={handleInputChange}>
						<option>Select Region</option>
						{renderRegions()}
					</select>
				</label>
				<label className="title">Trail Type:</label>
				<div>
					<label>
						<input
							type="radio"
							value="Cycling"
							//checked={state.selectedOption === 'Male'}
							name="Trail_Type"
							onChange={handleInputChange}
						/>
						Cycling
					</label>
				</div>
				<div>
					<label>
						<input
							type="radio"
							name="Trail_Type"
							value="Walking"
							onChange={handleInputChange}
						/>
						Walking
					</label>
				</div>
				<div>
					<label>
						<input
							type="radio"
							name="Trail_Type"
							value="4x4"
							onChange={handleInputChange}
						/>
						4x4
					</label>
				</div>
				<div>
					<label>
						<input
							type="radio"
							name="Trail_Type"
							value="VehicleRoute"
							onChange={handleInputChange}
						/>
						Vehicle Route
					</label>
				</div>
				<label className="title">
					Parking:
					<input type="checkbox" name="Parking" onChange={handleInputChange} />
				</label>
				<label className="title">
					Suitable for Children:
					<input
						type="checkbox"
						name="Suitable_for_Children"
						onChange={handleInputChange}
					/>
				</label>
				<label className="title">
					Suitable for Picnics:
					<input
						type="checkbox"
						name="Suitable_for_Picnics"
						onChange={handleInputChange}
					/>
				</label>
				<input type="submit" value="search" />
			</form>
		</Wrapper>
	);
};
export default Recomended;
