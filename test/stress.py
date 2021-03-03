#!/usr/bin/env python3.7

import aiohttp
import asyncio
from datetime import datetime

MAXREQ = 1000000
MAXTHREAD = 12
URL = 'https://api.rankey.info/xmen/stats'

g_thread_limit = asyncio.Semaphore(MAXTHREAD)


async def worker(session):
    async with session.get(URL) as response:
        await response.read()


async def run(worker, *argv):
    async with g_thread_limit:
        await worker(*argv)


async def main():
    async with aiohttp.ClientSession() as session:
        await asyncio.gather(*[run(worker, session) for _ in range(MAXREQ)])


if __name__ == '__main__':
    beging = datetime.now()
    asyncio.get_event_loop().run_until_complete(main())
    end = datetime.now()
    print(end - beging)