"use strict";
import React, { useState } from "react";
import PropTypes from 'prop-types';

const Button = props => {
	const [hover, setHoverState] = useState(false);
	const [active, setActiveState] = useState(false);

	const { 
		label,
		labelColor,
		borderColor,
		backgroundColor,
		onBtnClick,
		className,
		keywords,
	} = props;

	const buttonCSS = {
		fontWeight: 700,
		fontFamily: GetFontFamily("title"),
		transition: "background-color .1s ease-out,color .1s ease-out",
		outline: "none",
		height: "fit-content",
		fontSize: "1.25rem",
		padding: "0.75rem 1.4375rem",
		borderRadius: ".3125rem",
		color: labelColor,
		borderColor: borderColor,
		backgroundColor: backgroundColor,
	};

	const keywordsArray = () => {
		return keywords.split(" ");
	}

	const getKeywordModifier = (keyword) => {
		let keywordIndex = keywordsArray().indexOf(keyword);
		return keywordIndex > -1 ? keywordsArray()[keywordIndex - 1] : null;
	}

	const mergeWithDefaultStyles = (stylesObj, keyword) => {
		return NullifyEmptyObject(Object.assign(getKeywordStyles(keyword, false, "default") ?? {}, stylesObj));
	}

	const getKeywordStyles = (keyword, shouldMergeWithDefaultStyles = true, buttonState = null) => {
		const computedButtonState = buttonState ?? getButtonState();
		const modifier = getKeywordModifier(keyword);
		const stylesMap = {
			"default": {
				"hollow": {
					backgroundColor: "transparent",
					borderWidth: "2px",
					borderStyle: "solid",
				},
				"small": {
					fontSize: "0.875rem",
					padding: "0.4375rem 0.75rem",
					borderRadius: ".1875rem",
				},
				"label": {
					color: GetThemeColor(modifier),
				},
				"border": {
					borderColor: GetThemeColor(modifier),
				},
				"background": {
					backgroundColor: GetThemeColor(modifier),
				},
			},
			"hover": {
				"hollow": {
					/** auto-background for hollow buttons. will only be used if hover-background is not present. **/
					backgroundColor: GetThemeColor(getKeywordModifier("border")),
				},
				"hover-label": {
					color: GetThemeColor(modifier),
				},
				"hover-border": {
					borderColor: GetThemeColor(modifier),
				},
				"hover-background": {
					backgroundColor: GetThemeColor(modifier),
				},
			},
			"active": {
				"hollow": {
					/** auto-background for hollow buttons. will only be used if active-background is not present. **/
					backgroundColor: GetThemeColor(getKeywordModifier("border")),
				},
				"active-label": {
					color: GetThemeColor(modifier),
				},
				"active-border": {
					borderColor: GetThemeColor(modifier),
				},
				"active-background": {
					backgroundColor: GetThemeColor(modifier),
				},
			},
		}

		try {
			let styles = stylesMap[computedButtonState][keyword];
			return shouldMergeWithDefaultStyles ? mergeWithDefaultStyles(styles, keyword) : styles;
		} catch(error) {
			console.error(error);
			return null;
		}
	}

	const getButtonState = () => {
		return ((hover) ? "hover" : (active ? "active" : "default"));
	}

	const parseKeywords = () => {
		return keywordsArray().reduce((css, keyword, index, keywords) => {
			return Object.assign(css, getKeywordStyles(keyword));
		}, {});
	}
	
	return (
		<div className={"cell grid-x " + className}>
			<button 
				onMouseEnter={() => setHoverState(true)}
				onMouseLeave={() => setHoverState(false)}
				onFocus={() => setHoverState(true)}
				onBlur={() => setHoverState(false)}
				onMouseDown={() => setActiveState(true)}
				onMouseUp={() => setActiveState(false)}
				style={Object.assign(buttonCSS, parseKeywords())}
				onClick={onBtnClick}
				className={"cell"}
			>
				{label}
			</button>
		</div>
	);
}

Button.propTypes = {
	label: PropTypes.string.isRequired,
	isHollow: PropTypes.bool,
	isSmall: PropTypes.bool,
	labelColor: PropTypes.string,
	borderColor: PropTypes.string,
	backgroundColor: PropTypes.string,
	keywords: PropTypes.string,
	onBtnClick: PropTypes.func,
}

Button.defaultProps = {
	isHollow: false,
	isSmall: false,
	labelColor: GetThemeColor("white"),
	borderColor: GetThemeColor("green"),
	backgroundColor: GetThemeColor("green"),
	keywords: "",
	onBtnClick: () => {},
	className: "",
}

export default Button;
