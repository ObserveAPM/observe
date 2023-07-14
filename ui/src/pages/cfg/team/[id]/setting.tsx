import React from "react"
import { Box, Button, Input, useDisclosure, useToast, VStack, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, HStack, FormLabel } from "@chakra-ui/react"
import { Form, FormSection } from "components/form/Form"
import FormItem from "components/form/Item"
import { cloneDeep } from "lodash"
import { useRef, useState } from "react"
import { Team } from "types/teams"
import { requestApi } from "utils/axios/request"
import { useNavigate } from "react-router-dom"
import TeamLayout from "./components/Layout"
import { useStore } from "@nanostores/react"
import { cfgTeam, commonMsg } from "src/i18n/locales/en"

const TeamSettingPage = () => {
  return <>
    <TeamLayout>
      {/* @ts-ignore */}
      <TeamSettings />
    </TeamLayout>

  </>
}

export default TeamSettingPage

const TeamSettings = (props: { team: Team }) => {
  const t = useStore(commonMsg)
  const t1 = useStore(cfgTeam)
  const [team, setTeam] = useState<Team>(props.team)
  const navigate = useNavigate()
  const toast = useToast()




  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isLeaveOpen, onOpen: onLeaveOpen, onClose: onLeaveClose } = useDisclosure()
  const cancelRef = useRef()

  const updateTeam = async () => {
    await requestApi.post(`/team/update`, team)
    toast({
      title: t.isUpdated({name: t.members}),
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const deleteTeam = async () => {
    await requestApi.delete(`/team/${team.id}`)
    toast({
      title: t.isDeleted({name: t.team}),
      status: "success",
      duration: 3000,
      isClosable: true,
    })

    setTimeout(() => {
      navigate(`/cfg/teams`)
    }, 1000)
  }

  const leaveTeam = async () => {
    await requestApi.delete(`/team/leave/${team.id}`)
    toast({
      title: t1.leaveTeam,
      status: "success",
      duration: 3000,
      isClosable: true,
    })

    setTimeout(() => {
      navigate(`/cfg/teams`)
    }, 1000)
  }

  return <>
    <Box>
      <Form width="500px">
        <FormSection title={t.basicSetting}>
          <FormItem title={t.itemName({name: t.team})}>
            <Input placeholder="******" value={team.name} onChange={e => { team.name = e.currentTarget.value; setTeam(cloneDeep(team)) }} />
          </FormItem>
          <Button width="fit-content" onClick={updateTeam}>{t.submit}</Button>
        </FormSection>

        <FormSection title={t.dangeSection}>
          <HStack>
            <Button width="fit-content" onClick={onOpen} colorScheme="red">{t.deleteItem({name: t.team})}</Button>
            {/* <Button width="fit-content" onClick={onLeaveOpen} colorScheme="orange">Leave team</Button> */}
          </HStack>
        </FormSection>
      </Form>
    </Box>

    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        {team && <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {t.deleteItem({name: t.team})} - {team.name}
          </AlertDialogHeader>

          <AlertDialogBody>
           {t.deleteAlert}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {t.cancel}
            </Button>
            <Button colorScheme='orange' onClick={deleteTeam} ml={3}>
              {t.delete}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>}
      </AlertDialogOverlay>
    </AlertDialog>

    <AlertDialog
      isOpen={isLeaveOpen}
      onClose={onLeaveClose}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        {team && <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
           {t1.leaveTeam} - {team.name}
          </AlertDialogHeader>

          <AlertDialogBody>
           {t.deleteAlert}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onLeaveClose}>
              {t.cancel}
            </Button>
            <Button colorScheme='orange' onClick={leaveTeam} ml={3}>
              {t1.leaveTeam}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>}
      </AlertDialogOverlay>
    </AlertDialog>
  </>
}
