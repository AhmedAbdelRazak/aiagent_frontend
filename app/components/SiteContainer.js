import styled from "styled-components";

/**
 * A wrapper that is slightly wider than the
 * default `.container` but never edge‑to‑edge.
 */
const SiteContainer = styled.div`
	width: 100%;
	max-width: 1440px;
	padding-inline: ${({ theme }) => theme.containerPad};
	margin-inline: auto;
`;

export default SiteContainer;
