import Vue from 'vue'

import { NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh, ActionSheet, Dialog, Popup, Row, Col, Badge, Search, Divider, Tag, CellGroup, Image, Radio, RadioGroup, DatetimePicker, Lazyload } from 'vant'

const cmt = [NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh, ActionSheet, Dialog, Popup, Row, Col, Badge, Search, Divider, Tag, CellGroup, Image, Radio, RadioGroup, DatetimePicker, Lazyload]

cmt.forEach(item => Vue.use(item))
