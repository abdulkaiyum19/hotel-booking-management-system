/**
 * @name Hotel Room Booking System
 * @author Md. Samiur Rahman (Mukul)
 * @description Hotel Room Booking and Management System Software ~ Developed By Md. Samiur Rahman (Mukul)
 * @copyright ©2023 ― Md. Samiur Rahman (Mukul). All rights reserved.
 * @version v0.0.1
 *
 */

import { Empty, Result, Skeleton } from 'antd';
import axios from 'axios';
import getConfig from 'next/config';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Banner from '../../components/home/Banner';
import Hero from '../../components/home/Hero';
import MainLayout from '../../components/layout';
import RoomFilter from '../../components/rooms/RoomsFilter';
import RoomList from '../../components/rooms/RoomsList';

const { publicRuntimeConfig } = getConfig();

function Rooms(props) {
  const [ourRooms, setOurRooms] = useState([]);
  const [ourFilteredRooms, setOurFilteredRooms] = useState([]);

  useEffect(() => {
    if (props?.rooms) {
      setOurRooms(props?.rooms?.data?.rows || []);
      setOurFilteredRooms(props?.rooms?.data?.rows || []);
    }
  }, [props]);

  return (
    <MainLayout title='Beach Resort ― Rooms'>
      <Hero hero='roomsHero'>
        <Banner title='our rooms'>
          <Link className='btn-primary' href='/'>
            return home
          </Link>
        </Banner>
      </Hero>

      <Skeleton loading={!props?.rooms && !props?.error} paragraph={{ rows: 10 }} active>
        {props?.error ? (
          <Result
            title='Failed to fetch'
            subTitle={props?.error?.message || 'Sorry! Something went wrong. App server error'}
            status='error'
          />
        ) : ourRooms.length === 0 ? (
          <Empty
            className='mt-10'
            description={(<span>Sorry! Any data was not found.</span>)}
          />
        ) : (
          <>
            <RoomFilter
              ourRooms={ourRooms}
              setOurFilteredRooms={setOurFilteredRooms}
            />
            <RoomList
              rooms={ourFilteredRooms}
            />
          </>
        )}
      </Skeleton>
    </MainLayout>
  );
}

export async function getServerSideProps() {
  try {
    // API URL চেক করুন
    const apiURL = publicRuntimeConfig.API_BASE_URL || 'আপনার_ব্যাকেন্ড_লাইভ_ইউআরএল';
    const response = await axios.get(`${apiURL}/api/v1/all-rooms-list`);
    const rooms = response?.data?.result;

    return {
      props: {
        rooms: rooms || null,
        error: null
      }
    };
  } catch (err) {
    return {
      props: {
        rooms: null,
        error: { message: err.message }
      }
    };
  }
}

export default Rooms;
