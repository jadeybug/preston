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
		fontFamily,
		onBtnClick,
		className,
		keywords,
		style,
	} = props;

	const buttonCSS = {
		...style,
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
		if (Object.keys(stylesObj).length === 0 && stylesObj.constructor === Object) {
			return null
		}
		return Object.assign(getKeywordStyles(keyword, false, "default") ?? {}, stylesObj);
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
					color: modifier,
				},
				"border": {
					borderColor: modifier,
				},
				"background": {
					backgroundColor: modifier,
				},
			},
			"hover": {
				"hollow": {
					/** auto-background for hollow buttons. will only be used if hover-background is not present. **/
					backgroundColor: getKeywordModifier("border"),
				},
				"hover-label": {
					color: modifier,
				},
				"hover-border": {
					borderColor: modifier,
				},
				"hover-background": {
					backgroundColor: modifier,
				},
			},
			"active": {
				"hollow": {
					/** auto-background for hollow buttons. will only be used if active-background is not present. **/
					backgroundColor: getKeywordModifier("border"),
				},
				"active-label": {
					color: modifier,
				},
				"active-border": {
					borderColor: modifier,
				},
				"active-background": {
					backgroundColor: modifier,
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
		<button 
			onMouseEnter={() => setHoverState(true)}
			onMouseLeave={() => setHoverState(false)}
			onFocus={() => setHoverState(true)}
			onBlur={() => setHoverState(false)}
			onMouseDown={() => setActiveState(true)}
			onMouseUp={() => setActiveState(false)}
			style={Object.assign(buttonCSS, parseKeywords())}
			onClick={onBtnClick}
			className={className}
		>
			{label}
		</button>
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
	style: PropTypes.object,

}

Button.defaultProps = {
	isHollow: false,
	isSmall: false,
	labelColor: "white",
	borderColor: "black",
	backgroundColor: "gray",
	keywords: "",
	onBtnClick: () => {},
	className: "",
	fontFamily: "inherit",
	style: {},
}

export default Button;
