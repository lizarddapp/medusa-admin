import React, { useEffect, useState } from "react"
import SalesOrder from "./SalesOrder"
import BodyCard from "../../components/organisms/body-card"
import api from "../../services/api"
import { useQuery } from "@tanstack/react-query"
import moment from "moment"
import DatePicker from "../../components/atoms/date-picker/date-picker"
import { useAdminStore, useAdminSalesChannels } from "medusa-react"
import Select from "../../components/molecules/select"
import InputHeader from "../../components/fundamentals/input-header"
import { stringDisplayPrice } from "../../utils/prices"

const Analytics = () => {
  const { store } = useAdminStore()
  const [{ start_date, end_date, currency, sales_channel }, setDates] =
    useState({
      start_date: moment().startOf("month").toDate(),
      end_date: moment().endOf("day").toDate(),
      currency: {
        label: store?.default_currency.name || "USD",
        value: store?.default_currency.code || "usd",
      },
      sales_channel: {
        label: store?.default_sales_channel.name,
        value: store?.default_sales_channel.id,
      },
    })
  const { sales_channels } = useAdminSalesChannels()
  const { data, refetch } = useQuery({
    queryFn: () =>
      api.summary.get({
        currency_code: currency.value,
        sales_channel_id: sales_channel.value,
        start_date: moment(start_date).format("YYYY-MM-DD"),
        end_date: moment(end_date).format("YYYY-MM-DD"),
      }),
  })
  useEffect(() => {
    if (start_date && end_date) {
      refetch()
    }
  }, [start_date, end_date, currency, sales_channel])
  return (
    <div>
      <h1 className="inter-xlarge-semibold text-grey-90">Analytics</h1>
      <div className="mb-4 flex flex-row items-center gap-4 rounded bg-white p-4 shadow">
        <div className="w-1/4">
          <DatePicker
            selectsStart
            label="Start date"
            date={start_date}
            startDate={start_date}
            endDate={end_date}
            greyPastDates={false}
            onSubmitDate={(e) =>
              setDates((prev) => ({ ...prev, start_date: moment(e).toDate() }))
            }
          />
        </div>
        <div className="w-1/4">
          <DatePicker
            selectsEnd
            label="End date"
            date={end_date}
            startDate={start_date}
            endDate={end_date}
            greyPastDates={false}
            onSubmitDate={(e) =>
              setDates((prev) => ({ ...prev, end_date: moment(e).toDate() }))
            }
          />
        </div>
        <div className="w-1/4">
          <Select
            label="Currency"
            options={
              store?.currencies.map((el) => ({
                label: el.name,
                value: el.code,
              })) || []
            }
            value={currency}
            onChange={(e) =>
              setDates((prev) => ({
                ...prev,
                currency: e,
              }))
            }
          />
        </div>
        <div className="w-1/4">
          <Select
            label="Sales channel"
            options={
              sales_channels?.map((el) => ({
                label: el.name,
                value: el.id,
              })) || []
            }
            value={sales_channel}
            onChange={(e) =>
              setDates((prev) => ({
                ...prev,
                sales_channel: e,
              }))
            }
          />
        </div>
      </div>
      <BodyCard
        title={"Total order sales"}
        subtitle={stringDisplayPrice({
          amount: data?.data.totalSales,
          currencyCode: currency.value,
        })}
      >
        <SalesOrder data={data?.data} />

        <div className="mt-4 flex flex-row gap-x-4 ">
          <div className="rounded border p-4">
            <>Total Refunded</>
            <InputHeader
              label={stringDisplayPrice({
                amount: data?.data.totalRefunded,
                currencyCode: currency.value,
              })}
            />
          </div>
          <div className="rounded border p-4">
            <>Total Awaiting</>
            <InputHeader
              label={stringDisplayPrice({
                amount: data?.data.totalAwaiting,
                currencyCode: currency.value,
              })}
            />
          </div>
        </div>
      </BodyCard>
    </div>
  )
}

export default Analytics
