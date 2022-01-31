import * as React from "react";
import styled, { DefaultTheme, ThemeProps } from "styled-components";

type Props = {
  icon: React.ReactNode;
  title: React.ReactNode;
  context?: React.ReactNode;
  href: string;
  isSelected: boolean;
  children?: React.ReactNode;
};

export default function Widget(props: Props & ThemeProps<DefaultTheme>) {
  return (
    <Wrapper
      className={
        props.isSelected ? "ProseMirror-selectednode widget" : "widget"
      }
      href={props.href}
      target="_blank"
      rel="noreferrer nofollow"
    >
      {props.icon}
      <Preview>
        <Title>{props.title}</Title>
        <Subtitle>{props.context}</Subtitle>
        <Children>{props.children}</Children>
      </Preview>
    </Wrapper>
  );
}

const Children = styled.div`
  margin-left: auto;
  height: 20px;
  opacity: 0;

  &:hover {
    color: ${(props) => props.theme.text};
  }
`;

const Title = styled.strong`
  font-weight: 500;
  font-size: 14px;
  color: ${(props) => props.theme.text};
`;

const Preview = styled.div`
  gap: 8px;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  align-items: center;
  color: ${(props) => props.theme.textTertiary};
`;

const Subtitle = styled.span`
  font-size: 13px;
  color: ${(props) => props.theme.textTertiary} !important;
  line-height: 0;
`;

const Wrapper = styled.a`
  display: inline-flex;
  align-items: flex-start;
  gap: 6px;
  color: ${(props) => props.theme.text} !important;
  outline: 1px solid ${(props) => props.theme.divider};
  white-space: nowrap;
  border-radius: 8px;
  padding: 6px 8px;
  max-width: 840px;
  width: 100%;

  user-select: none;
  text-overflow: ellipsis;
  overflow: hidden;

  &:hover,
  &:active {
    background: ${(props) => props.theme.secondaryBackground};
    outline: 1px solid ${(props) => props.theme.divider};

    ${Children} {
      opacity: 1;
    }
  }
`;
