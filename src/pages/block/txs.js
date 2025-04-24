import React, { useCallback, useEffect, useMemo, useState } from 'react'
import to from 'await-to-js'
import { Link } from 'react-router-dom'
import { css } from 'goober'
import { useNodeSocket } from '@xelis/sdk/react/daemon'
import { useLang } from 'g45-react/hooks/useLang'

import { formatDapa, reduceText } from '../../utils'
import Table from '../../components/table'
import Pagination, { getPaginationRange } from '../../components/pagination'
import Hashicon from '../../components/hashicon'
import { formatAddr } from '../../utils/known_addrs'

const style = {
  container: css`
    h2 {
      margin: 1em 0 .5em 0;
      font-weight: bold;
      font-size: 1.5em;
    }

    > :nth-child(2) {
      margin-bottom: .5em;
    }

    table td:nth-child(3) > div {
      display: flex;
      gap: .5em;
      align-items: center;
    }
  `
}

function Transactions(props) {
  const { block } = props

  const nodeSocket = useNodeSocket()

  const txCount = useMemo(() => {
    return (block.txs_hashes || []).length
  }, [block])
  const { t } = useLang()

  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState()
  const [transactions, setTransactions] = useState([])
  const [pageState, setPageState] = useState({ page: 1, size: 5 })

  const load = useCallback(async () => {
    if (nodeSocket.readyState !== WebSocket.OPEN) return
    setErr(null)
    setLoading(true)

    const resErr = (err) => {
      setLoading(false)
      setErr(err)
    }

    let { start, end } = getPaginationRange(pageState)

    let txHashes = block.txs_hashes || []
    const txCount = txHashes.length
    start = Math.min(txCount, start)
    end = Math.min(txCount, end)
    txHashes = txHashes.slice(start, end + 1)
    const [err, txs] = await to(nodeSocket.daemon.methods.getTransactions(txHashes))
    if (err) return resErr(err)

    setTransactions(txs)
    setLoading(false)
  }, [block, pageState, nodeSocket.readyState])

  useEffect(() => {
    if (Object.keys(block).length > 0) load()
  }, [block, load])

  return <div className={style.container}>
    <h2>{t('Transactions')}</h2>
    <Table
      headers={[t(`Hash`), t(`Transfers / Burns`), t(`Signer`), t(`Fees`)]}
      list={transactions} loading={loading} err={err} emptyText={t('No transactions')} colSpan={4}
      onItem={(item) => {
        const transfers = item.data.transfers || []

        // only one burn per tx for now but I expect multiple burns per tx later
        let burns = []
        if (item.data.burn) burns = [item.data.burn]

        return <React.Fragment key={item.hash}>
          <tr>
            <td>
              <Link to={`/txs/${item.hash}`}>
                {reduceText(item.hash)}
              </Link>
            </td>
            <td>{transfers.length} / {burns.length}</td>
            <td>
              <div>
                <Hashicon value={item.source} size={20} />
                <Link to={`/accounts/${item.source}`}>
                  {formatAddr(item.source)}
                </Link>
              </div>
            </td>
            <td>{formatDapa(item.fee)}</td>
          </tr>
        </React.Fragment>
      }}
    />
    <Pagination state={pageState} setState={setPageState} count={txCount}
      formatCount={(count) => t('{} txs', [count.toLocaleString()])}
    />
  </div>
}

export default Transactions
