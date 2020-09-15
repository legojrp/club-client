import React from 'react';
import MemberCard from './MemberCard'



const MemberList = ({clubMembers, club}) => {
    return(
        <div style={{width: "100%", display: "flex", flexWrap: 'wrap'}}>
                        {clubMembers.sponsors.map((sponsor) => {
                            return <MemberCard club={club} member={sponsor} defaultTitle="Sponsor"></MemberCard>
                        })}
                         {clubMembers.officers.map((officer) => {
                            return <MemberCard club={club} member={officer} defaultTitle="Officer"></MemberCard>
                        })}
                        {clubMembers.members.map((member) => {
                            return <MemberCard club={club} member={member} defaultTitle="Member"></MemberCard>
                        })}
        </div>
    )
}

export default MemberList