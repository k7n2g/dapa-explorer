import { Outlet, useLocation } from 'react-router'
import { useMemo, useRef } from 'react'
import { useLang } from 'g45-react/hooks/useLang'
import Icon from 'g45-react/components/fontawesome_icon'
import { css } from 'goober'

import Header from './header'
import Footer from './footer'
import NodeStatus from './node_status'
import packageJSON from '../../package.json'
import Background from './background'
import layoutStyle from '../style/layout'

const style = {
  nodeStatusContainer: css`
    display: flex;
    justify-content: center;
  `
}

function Layout() {
  const location = useLocation()
  const firstLocation = useRef(location)
  const { t } = useLang()

  const firstLoad = firstLocation.current.key === location.key

  const links = useMemo(() => {
    return [
      { path: `/`, title: t(`Home`), icon: <Icon name="house" /> },
      { path: `/blocks`, title: t(`Blocks`), icon: <Icon name="boxes-stacked" /> },
      { path: `/mempool`, title: t(`Mempool`), icon: <Icon name="square-poll-horizontal" /> },
      { path: `/dag`, title: `DAG`, icon: <Icon name="network-wired" /> },
      { path: `/accounts`, title: t(`Accounts`), icon: <Icon name="user-group" /> },
      { path: `/peers`, title: t(`Peers`), icon: <Icon name="ethernet" /> },
      { path: `/mining-calculator`, title: t('Mining Calculator'), icon: <Icon name="calculator" /> },
      { path: `/settings`, title: t(`Settings`), icon: <Icon name="gear" /> }
    ]
  }, [t])

  const footerProps = useMemo(() => {
    return {
      title: t('DAPA Explorer'),
      description: t(`The explorer allows you to track and verify transactions on DAPA network. You can search for specific transactions and monitor the overall health of the network.`),
      version: `v${packageJSON.version}`,
      links: [
        { href: `https://dapahe.com`, title: t('Home'), icon: <Icon name="home" /> },
        { href: STATS_LINK, title: t('Statistics'), icon: <Icon name="chart-simple" /> },
        { href: `https://docs.dapahe.com`, title: t('Documentation'), icon: <Icon name="book" /> },
        { href: `https://github.com/k7n2g/dapa`, title: `GitHub`, icon: <Icon name="github" type="brands" /> },
        { href: `https://discord.gg/`, title: `Discord`, icon: <Icon name="discord" type="brands" /> },
      ],
      pages: links
    }
  }, [t, links])

  return <>
    <div className={layoutStyle.container}>
      <Background />
      <div className={layoutStyle.pageFlex}>
        <Header title={t(`Explorer`)} links={links} />
        <div className={layoutStyle.pageMaxWidth}>
          <div className={style.nodeStatusContainer}>
            <NodeStatus />
          </div>
          <div data-opacity={!firstLoad} key={location.key}> {/* Keep location key to re-trigger page transition animation */}
            <Outlet />
          </div>
        </div>
        <Footer {...footerProps} />
      </div>
    </div>
  </>
}

export default Layout
