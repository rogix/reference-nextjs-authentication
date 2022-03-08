import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Header } from './Header'

export default {
  title: 'componts/Header',
  component: Header,
} as ComponentMeta<typeof Header>

const Template: ComponentStory<typeof Header> = () => <Header />

export const BasicHeader = Template.bind({})
BasicHeader.args = {}
