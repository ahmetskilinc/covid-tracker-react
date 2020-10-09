import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";

function Nav() {
	return (
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6">Covid Tracker</Typography>
			</Toolbar>
		</AppBar>
	);
}

export default Nav;
