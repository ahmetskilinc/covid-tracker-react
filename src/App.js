import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import Nav from "./Nav";
import { prettyPrintStat } from "./util";
import numeral from "numeral";

function App() {
	const [country, setInputCountry] = useState("worldwide");
	const [countryInfo, setCountryInfo] = useState({});
	const [countries, setCountries] = useState([]);
	const [casesType, setCasesType] = useState("cases");

	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);

	useEffect(() => {
		const getCountriesData = async () => {
			fetch("https://disease.sh/v3/covid-19/countries")
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));
					setCountries(countries);
				});
		};

		getCountriesData();
	}, []);

	const onCountryChange = async (e) => {
		const countryCode = e.target.value;

		const url =
			countryCode === "worldwide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;
		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setInputCountry(countryCode);
				setCountryInfo(data);
			});
	};

	return (
		<>
			<Nav />
			<div className="app">
				<div className="app__topbar">
					<h1>Stats</h1>
					<FormControl variant="outlined" className="app__select">
						<InputLabel id="country-select-label">Country</InputLabel>
						<Select
							onChange={onCountryChange}
							labelId="country-select-label"
							id="country-select"
							label="Country"
							value={country}
						>
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country) => (
								<MenuItem value={country.value}>{country.name}</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className="app__stats">
					<InfoBox
						onClick={(e) => setCasesType("cases")}
						title="Coronavirus Cases"
						isRed
						active={casesType === "cases"}
						cases={prettyPrintStat(countryInfo.todayCases)}
						total={numeral(countryInfo.cases).format("0.0a")}
					/>
					<InfoBox
						onClick={(e) => setCasesType("recovered")}
						title="Recovered"
						active={casesType === "recovered"}
						cases={prettyPrintStat(countryInfo.todayRecovered)}
						total={numeral(countryInfo.recovered).format("0.0a")}
					/>
					<InfoBox
						onClick={(e) => setCasesType("deaths")}
						title="Deaths"
						isRed
						active={casesType === "deaths"}
						cases={prettyPrintStat(countryInfo.todayDeaths)}
						total={numeral(countryInfo.deaths).format("0.0a")}
					/>
				</div>
			</div>
		</>
	);
}

export default App;
